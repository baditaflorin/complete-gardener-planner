import type { DiseaseSignature, Plant } from '../../types/domain'

export type VisualSignals = {
  redRatio: number
  greenRatio: number
  blueRatio: number
  brightness: number
  whitePatchRatio?: number
  brownSpotRatio?: number
  yellowRatio?: number
}

export type GardenEvidence = {
  filename: string
  mediaType: string
  sizeBytes: number
  text?: string
  visual?: VisualSignals | null
  decodeError?: string
  sourceUrl?: string
}

export type ConfidenceLevel = 'low' | 'medium' | 'high'

export type InferenceCandidate = {
  id: string
  label: string
  confidence: number
  level: ConfidenceLevel
  reasons: string[]
  warnings: string[]
}

export type GardenInputErrorKind = 'unsupported-format' | 'corrupt-image' | 'too-large' | 'empty-input'

export type GardenInputErrorDetails = {
  kind: GardenInputErrorKind
  what: string
  why: string
  nowWhat: string
  recoverable: boolean
}

export type InferenceShape =
  | 'single-plant'
  | 'mixed-bed'
  | 'disease-closeup'
  | 'soil-report'
  | 'weather-csv'
  | 'unknown'

export type GardenInference = {
  schemaVersion: 'garden-inference.v2'
  inputId: string
  shape: InferenceShape
  plantCandidates: InferenceCandidate[]
  diseaseCandidates: InferenceCandidate[]
  suggestedCropIds: string[]
  diagnostics: string[]
  extracted: {
    soil?: {
      ph?: number
      organicMatterPercent?: number
    }
    weatherFields?: string[]
  }
  provenance: {
    sourceIdentifier: string
    evidenceHash: string
    plantCatalogSize: number
    diseaseCatalogSize: number
  }
}

export type InferenceContext = {
  plants: Plant[]
  diseases: DiseaseSignature[]
  correctionMemory?: CorrectionMemory
}

export type CorrectionMemory = {
  preferredCropIds: string[]
}
