import { Check, ClipboardCopy } from 'lucide-react'
import type { Plant } from '../../../types/domain'
import type { PhotoAnalysisResult } from '../../../lib/photoAnalysis'
import { labelForPlant } from '../../../lib/planModel'

type Props = {
  result: PhotoAnalysisResult
  plants: Plant[]
  debug: boolean
  onApplySuggestions: () => void
  onCopyAnalysis: () => void
}

export function AnalysisResultView({ result, plants, debug, onApplySuggestions, onCopyAnalysis }: Props) {
  const topPlant = result.plantCandidates[0]
  return (
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
          onClick={onApplySuggestions}
        >
          <Check size={16} /> Apply crop guesses: {labelsFor(plants, result.suggestedCropIds)}
        </button>
      )}
      <button className="icon-button text-button apply-suggestions" type="button" onClick={onCopyAnalysis}>
        <ClipboardCopy size={16} /> Copy analysis JSON
      </button>
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
      {result.diagnostics.length > 0 && <p className="muted">Diagnostics: {result.diagnostics.join(', ')}</p>}
      {debug && (
        <pre className="debug-panel">
          {JSON.stringify({ provenance: result.provenance, inputId: result.inputId }, null, 2)}
        </pre>
      )}
    </div>
  )
}

function labelsFor(plants: Plant[], ids: string[]) {
  return ids.map((id) => labelForPlant(plants, id)).join(', ')
}
