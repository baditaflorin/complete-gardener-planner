import { useMemo, useState } from 'react'
import { Camera, ImageUp } from 'lucide-react'
import { analyzeGardenPhoto, type PhotoAnalysisResult } from '../../../lib/photoAnalysis'
import type { DiseaseSignature, Plant } from '../../../types/domain'

type Props = {
  plants: Plant[]
  diseases: DiseaseSignature[]
}

export function PhotoAnalyzer({ plants, diseases }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<PhotoAnalysisResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const topPlant = useMemo(() => result?.plantCandidates[0], [result])

  async function onFile(file: File | undefined) {
    if (!file) {
      return
    }
    setBusy(true)
    setError(null)
    const url = URL.createObjectURL(file)
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return url
    })
    try {
      setResult(await analyzeGardenPhoto(file, plants, diseases))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Photo analysis failed')
    } finally {
      setBusy(false)
    }
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
        {preview ? <img src={preview} alt="Uploaded garden preview" /> : <span><ImageUp size={24} /> Upload leaf, bed, or crop photo</span>}
      </label>

      {busy && <p className="muted">Analyzing pixels and loading the local inference adapter...</p>}
      {error && <p className="notice notice-error">{error}</p>}

      {result && (
        <div className="analysis-result">
          <p className="status-pill">{result.modelStatus}</p>
          <strong>{topPlant ? `${topPlant.label} (${Math.round(topPlant.confidence * 100)}%)` : 'No plant candidate'}</strong>
          <div className="analysis-columns">
            <div>
              <span className="mini-heading">Plant candidates</span>
              {result.plantCandidates.map((candidate) => (
                <p key={candidate.id}>{candidate.label}: {Math.round(candidate.confidence * 100)}%</p>
              ))}
            </div>
            <div>
              <span className="mini-heading">Disease hints</span>
              {result.diseaseCandidates.map((candidate) => (
                <p key={candidate.id}>{candidate.label}: {candidate.actions[0]}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
