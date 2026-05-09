import { useMemo, useReducer, useRef, useState } from 'react'
import { Camera, Check, ImageUp, X } from 'lucide-react'
import { rememberCropCorrection } from '../../../lib/inference/corrections'
import { describeCaughtError } from '../../../lib/inference/errors'
import { photoAnalysisReducer, type PhotoAnalysisState } from '../../../lib/inference/state'
import { analyzeGardenPhoto, type PhotoAnalysisResult } from '../../../lib/photoAnalysis'
import type { DiseaseSignature, Plant } from '../../../types/domain'

type Props = {
  plants: Plant[]
  diseases: DiseaseSignature[]
  onApplySuggestedCrops: (cropIds: string[]) => void
}

const initialState: PhotoAnalysisState<PhotoAnalysisResult> = { status: 'idle', requestId: 0 }

export function PhotoAnalyzer({ plants, diseases, onApplySuggestedCrops }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [state, dispatch] = useReducer(photoAnalysisReducer<PhotoAnalysisResult>, initialState)
  const requestID = useRef(0)
  const abortController = useRef<AbortController | null>(null)
  const result = state.status === 'ready' ? state.result : null
  const topPlant = useMemo(() => result?.plantCandidates[0], [result])
  const busy = state.status === 'validating' || state.status === 'analyzing'
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')

  async function onFile(file: File | undefined) {
    if (!file) {
      return
    }
    abortController.current?.abort()
    const nextRequestID = requestID.current + 1
    requestID.current = nextRequestID
    const controller = new AbortController()
    abortController.current = controller
    dispatch({ type: 'start', requestId: nextRequestID, filename: file.name })
    const url = URL.createObjectURL(file)
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return url
    })
    try {
      window.setTimeout(() => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'progress', requestId: nextRequestID, progress: 'Reading image signals...' })
        }
      }, 300)
      const nextResult = await analyzeGardenPhoto(file, plants, diseases, controller.signal)
      dispatch({ type: 'ready', requestId: nextRequestID, filename: file.name, result: nextResult })
    } catch (caught) {
      if (controller.signal.aborted) {
        dispatch({ type: 'cancel', requestId: nextRequestID, filename: file.name })
      } else {
        dispatch({
          type: 'error',
          requestId: nextRequestID,
          filename: file.name,
          error: describeCaughtError(caught),
        })
      }
    }
  }

  function cancelAnalysis() {
    abortController.current?.abort()
  }

  function applySuggestions() {
    if (!result) return
    rememberCropCorrection(result.suggestedCropIds)
    onApplySuggestedCrops(result.suggestedCropIds)
  }

  return (
    <section className="planner-panel photo-panel" aria-labelledby="photo-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PlantNet-style photo flow</p>
          <h2 id="photo-title">Snap garden photo</h2>
        </div>
        <Camera size={22} aria-hidden="true" />
      </div>

      <label className="photo-drop">
        <input type="file" accept="image/*" onChange={(event) => void onFile(event.target.files?.[0])} />
        {preview ? (
          <img src={preview} alt="Uploaded garden preview" />
        ) : (
          <span>
            <ImageUp size={24} /> Upload leaf, bed, or crop photo
          </span>
        )}
      </label>

      {busy && (
        <div className="analysis-progress">
          <p className="muted">
            {state.status === 'analyzing' ? state.progress : 'Checking format and file size...'}
          </p>
          <button className="icon-button" type="button" onClick={cancelAnalysis} aria-label="Cancel analysis">
            <X size={16} />
          </button>
        </div>
      )}
      {state.status === 'cancelled' && (
        <p className="muted">Analysis cancelled. Upload another photo when ready.</p>
      )}
      {state.status === 'error-recoverable' && (
        <div className="notice notice-error" role="alert">
          <strong>{state.error.what}</strong>
          <span>{state.error.why}</span>
          <span>{state.error.nowWhat}</span>
        </div>
      )}

      {result && (
        <div className="analysis-result">
          <div className="analysis-badges">
            <p className="status-pill">{result.modelStatus}</p>
            <p className="status-pill">{result.shape}</p>
            <p className="status-pill">{result.performanceMs} ms</p>
          </div>
          <strong>
            {topPlant
              ? `${topPlant.label} (${Math.round(topPlant.confidence * 100)}%, ${topPlant.level})`
              : 'No plant candidate'}
          </strong>
          {result.suggestedCropIds.length > 0 && (
            <button
              className="icon-button text-button apply-suggestions"
              type="button"
              onClick={applySuggestions}
            >
              <Check size={16} /> Apply crop guesses: {labelsFor(plants, result.suggestedCropIds)}
            </button>
          )}
          <div className="analysis-columns">
            <div>
              <span className="mini-heading">Plant candidates</span>
              {result.plantCandidates.map((candidate) => (
                <details key={candidate.id} className="candidate-detail">
                  <summary>
                    {candidate.label}: {Math.round(candidate.confidence * 100)}% ({candidate.level})
                  </summary>
                  {candidate.reasons.map((reason) => (
                    <p key={reason}>{reason}</p>
                  ))}
                  {candidate.warnings.map((warning) => (
                    <p className="warning-text" key={warning}>
                      {warning}
                    </p>
                  ))}
                </details>
              ))}
            </div>
            <div>
              <span className="mini-heading">Disease hints</span>
              {result.diseaseCandidates.map((candidate) => (
                <details key={candidate.id} className="candidate-detail">
                  <summary>
                    {candidate.label}: {Math.round(candidate.confidence * 100)}% ({candidate.level})
                  </summary>
                  {candidate.reasons.map((reason) => (
                    <p key={reason}>{reason}</p>
                  ))}
                  {candidate.warnings.map((warning) => (
                    <p className="warning-text" key={warning}>
                      {warning}
                    </p>
                  ))}
                </details>
              ))}
            </div>
          </div>
          {result.diagnostics.length > 0 && (
            <p className="muted">Diagnostics: {result.diagnostics.join(', ')}</p>
          )}
          {debug && (
            <pre className="debug-panel">
              {JSON.stringify({ provenance: result.provenance, inputId: result.inputId }, null, 2)}
            </pre>
          )}
        </div>
      )}
    </section>
  )
}

function labelsFor(plants: Plant[], ids: string[]) {
  return ids.map((id) => plants.find((plant) => plant.id === id)?.common_name ?? id).join(', ')
}
