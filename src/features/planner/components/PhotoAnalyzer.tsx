import { useReducer, useRef, useState, type ClipboardEvent, type DragEvent } from 'react'
import { Camera, Check, FileText, ImageUp, Link2, X } from 'lucide-react'
import { rememberCropCorrection } from '../../../lib/inference/corrections'
import { describeCaughtError } from '../../../lib/inference/errors'
import { photoAnalysisReducer, type PhotoAnalysisState } from '../../../lib/inference/state'
import { analyzeGardenPhoto, analyzeGardenText, type PhotoAnalysisResult } from '../../../lib/photoAnalysis'
import { serializeAnalysisResult } from '../../../lib/planIO'
import type { DiseaseSignature, Plant } from '../../../types/domain'
import { AnalysisResultView } from './AnalysisResultView'

type Props = {
  plants: Plant[]
  diseases: DiseaseSignature[]
  onApplySuggestedCrops: (cropIds: string[]) => void
}

const initialState: PhotoAnalysisState<PhotoAnalysisResult> = { status: 'idle', requestId: 0 }
const sampleEvidence =
  'Raised bed note: tomato with basil and marigold, white powder on cucumber leaves, soil pH 6.7 and organic matter 4.1%.'

export function PhotoAnalyzer({ plants, diseases, onApplySuggestedCrops }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [textEvidence, setTextEvidence] = useState('')
  const [urlEvidence, setUrlEvidence] = useState('')
  const [inputStatus, setInputStatus] = useState('Upload, drop, paste, or type garden evidence.')
  const [batchMessages, setBatchMessages] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [state, dispatch] = useReducer(photoAnalysisReducer<PhotoAnalysisResult>, initialState)
  const requestID = useRef(0)
  const abortController = useRef<AbortController | null>(null)
  const result = state.status === 'ready' ? state.result : null
  const busy = state.status === 'validating' || state.status === 'analyzing'
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')

  async function onFiles(files: FileList | File[] | null | undefined) {
    const selected = Array.from(files ?? [])
    if (selected.length === 0) {
      return
    }
    setBatchMessages([])
    for (const file of selected) {
      await onFile(file)
      setBatchMessages((messages) => [...messages, `Analyzed ${file.name}`])
    }
  }

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
      setInputStatus(`Analyzing ${file.name}`)
      window.setTimeout(() => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'progress', requestId: nextRequestID, progress: 'Reading image signals...' })
        }
      }, 300)
      const nextResult = await analyzeGardenPhoto(file, plants, diseases, controller.signal)
      dispatch({ type: 'ready', requestId: nextRequestID, filename: file.name, result: nextResult })
      setInputStatus(`Ready: ${file.name}`)
    } catch (caught) {
      if (controller.signal.aborted) {
        dispatch({ type: 'cancel', requestId: nextRequestID, filename: file.name })
        setInputStatus('Analysis cancelled')
      } else {
        dispatch({
          type: 'error',
          requestId: nextRequestID,
          filename: file.name,
          error: describeCaughtError(caught),
        })
        setInputStatus('Input needs attention')
      }
    }
  }

  async function analyzeTextInput(text: string, filename = 'pasted-garden-note.txt', sourceUrl?: string) {
    const trimmed = text.trim()
    if (!trimmed) {
      setInputStatus('Paste or type a garden note before analyzing text.')
      return
    }
    abortController.current?.abort()
    const nextRequestID = requestID.current + 1
    requestID.current = nextRequestID
    const controller = new AbortController()
    abortController.current = controller
    dispatch({ type: 'start', requestId: nextRequestID, filename })
    setPreview(null)
    setInputStatus(`Analyzing ${filename}`)
    await new Promise((resolve) => window.setTimeout(resolve, 0))
    if (controller.signal.aborted) {
      dispatch({ type: 'cancel', requestId: nextRequestID, filename })
      return
    }
    try {
      dispatch({ type: 'progress', requestId: nextRequestID, progress: 'Reading text evidence...' })
      const nextResult = analyzeGardenText({ text: trimmed, plants, diseases, filename, sourceUrl })
      dispatch({ type: 'ready', requestId: nextRequestID, filename, result: nextResult })
      setInputStatus(`Ready: ${filename}`)
    } catch (caught) {
      dispatch({
        type: 'error',
        requestId: nextRequestID,
        filename,
        error: describeCaughtError(caught),
      })
      setInputStatus('Input needs attention')
    }
  }

  async function analyzeUrlInput() {
    const url = urlEvidence.trim()
    if (!url) {
      setInputStatus('Enter a public URL or paste the page text instead.')
      return
    }
    abortController.current?.abort()
    const controller = new AbortController()
    abortController.current = controller
    setInputStatus('Fetching URL text...')
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`The site returned HTTP ${response.status}.`)
      }
      const text = await response.text()
      await analyzeTextInput(text, new URL(url).hostname, url)
    } catch (caught) {
      if (controller.signal.aborted) {
        setInputStatus('URL fetch cancelled')
      } else {
        setInputStatus(
          caught instanceof Error
            ? `${caught.message} If the browser blocks this site, paste the visible page text instead.`
            : 'The browser could not read that URL. Paste the visible page text instead.',
        )
      }
    }
  }

  function onDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault()
    setDragActive(false)
    void onFiles(event.dataTransfer.files)
  }

  function onPaste(event: ClipboardEvent<HTMLElement>) {
    const files = Array.from(event.clipboardData.files)
    if (files.length > 0) {
      void onFiles(files)
      return
    }
    const text = event.clipboardData.getData('text/html') || event.clipboardData.getData('text/plain')
    if (text.trim()) {
      setTextEvidence(text)
      void analyzeTextInput(text)
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

  async function copyAnalysis() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(serializeAnalysisResult(result))
      setInputStatus('Copied analysis JSON')
    } catch {
      setInputStatus(
        'Clipboard access is not available. Use debug mode or browser dev tools to inspect JSON.',
      )
    }
  }

  return (
    <section
      className="planner-panel photo-panel"
      aria-labelledby="photo-title"
      onPaste={onPaste}
      onDragEnter={() => setDragActive(true)}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">PlantNet-style photo flow</p>
          <h2 id="photo-title">Snap garden photo</h2>
        </div>
        <Camera size={22} aria-hidden="true" />
      </div>

      <label className={dragActive ? 'photo-drop photo-drop-active' : 'photo-drop'}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(event) => void onFiles(event.target.files)}
        />
        {preview ? (
          <img src={preview} alt="Uploaded garden preview" />
        ) : (
          <span>
            <ImageUp size={24} /> Upload leaf, bed, or crop photo
          </span>
        )}
      </label>
      <p className="muted">{inputStatus}</p>

      <div className="evidence-grid">
        <label>
          Paste garden note, soil report, or weather CSV
          <textarea
            value={textEvidence}
            onChange={(event) => setTextEvidence(event.target.value)}
            aria-describedby="text-evidence-help"
          />
          <span id="text-evidence-help" className="field-help">
            Example: tomato and basil bed, cucumber leaves have white powder, soil pH 6.6.
          </span>
        </label>
        <div className="evidence-actions">
          <button
            className="icon-button text-button"
            type="button"
            onClick={() => void analyzeTextInput(textEvidence)}
          >
            <FileText size={16} /> Analyze text
          </button>
          <button
            className="icon-button text-button"
            type="button"
            onClick={() => {
              setTextEvidence(sampleEvidence)
              void analyzeTextInput(sampleEvidence, 'sample-raised-bed-note.txt')
            }}
          >
            <Check size={16} /> Load sample
          </button>
        </div>
        <label>
          URL text input
          <input
            type="url"
            value={urlEvidence}
            onChange={(event) => setUrlEvidence(event.target.value)}
            aria-describedby="url-evidence-help"
          />
          <span id="url-evidence-help" className="field-help">
            If the browser cannot read the site, paste the visible page text.
          </span>
        </label>
        <button className="icon-button text-button" type="button" onClick={() => void analyzeUrlInput()}>
          <Link2 size={16} /> Fetch URL text
        </button>
      </div>
      {batchMessages.length > 0 && <p className="muted">Batch: {batchMessages.join('; ')}</p>}

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
        <AnalysisResultView
          result={result}
          plants={plants}
          debug={debug}
          onApplySuggestions={applySuggestions}
          onCopyAnalysis={() => void copyAnalysis()}
        />
      )}
    </section>
  )
}
