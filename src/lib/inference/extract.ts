import { normalizeText } from './normalize'
import type { GardenInference, InferenceCandidate } from './types'

export function extractEvidenceFields(text: string, mediaType: string, diagnostics: Set<string>) {
  return {
    soil: extractSoil(text, diagnostics),
    weatherFields: extractWeatherFields(text, mediaType, diagnostics),
  }
}

export function detectInputShape(
  normalizedAll: string,
  plantCandidates: InferenceCandidate[],
  diseaseCandidates: InferenceCandidate[],
  extracted: GardenInference['extracted'],
  diagnostics: Set<string>,
): GardenInference['shape'] {
  if (extracted.soil?.ph || extracted.soil?.organicMatterPercent) return 'soil-report'
  if (extracted.weatherFields && extracted.weatherFields.length > 0) return 'weather-csv'
  const likelyPlantCount = plantCandidates.filter((candidate) => candidate.confidence >= 0.5).length
  if (
    normalizedAll.includes('raised bed') ||
    normalizedAll.includes('mixed crops') ||
    likelyPlantCount >= 3
  ) {
    diagnostics.add('mixed-bed')
    return 'mixed-bed'
  }
  if (diseaseCandidates.some((candidate) => candidate.confidence >= 0.5)) return 'disease-closeup'
  if (plantCandidates.some((candidate) => candidate.confidence >= 0.5)) return 'single-plant'
  return 'unknown'
}

function extractSoil(text: string, diagnostics: Set<string>) {
  if (!text.includes('soil') && !text.includes('organic matter') && !text.includes('ph')) return undefined
  const ph = numberAfter(text, /\bph\s*(\d+(?:\.\d+)?)/)
  const organicMatterPercent = numberAfter(text, /organic matter\s*(\d+(?:\.\d+)?)/)
  if (ph || organicMatterPercent) {
    diagnostics.add('soil-report')
  }
  if (ph && ph > 7.2) {
    diagnostics.add('alkaline-soil')
  }
  return { ph, organicMatterPercent }
}

function extractWeatherFields(text: string, mediaType: string, diagnostics: Set<string>) {
  const fields = ['precipitation_mm', 'et0_fao_evapotranspiration', 'temperature_2m_mean'].filter((field) =>
    text.includes(normalizeText(field)),
  )
  if (fields.length > 0 || mediaType.includes('csv')) {
    diagnostics.add('weather-csv')
  }
  return fields.length > 0 ? fields : undefined
}

function numberAfter(text: string, pattern: RegExp) {
  const match = text.match(pattern)
  return match ? Number(match[1]) : undefined
}
