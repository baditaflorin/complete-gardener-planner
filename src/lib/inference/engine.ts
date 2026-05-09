import type { DiseaseSignature, Plant } from '../../types/domain'
import { inputError } from './errors'
import { evidenceText, normalizeText, stableHash } from './normalize'
import { aliasesForPlant, diseaseAliasHits, plantAliasHits } from './vocabulary'
import type {
  GardenEvidence,
  GardenInference,
  InferenceCandidate,
  InferenceContext,
  VisualSignals,
} from './types'

const MAX_BROWSER_IMAGE_BYTES = 15 * 1024 * 1024

export function analyzeGardenEvidence(evidence: GardenEvidence, context: InferenceContext): GardenInference {
  validateEvidence(evidence)

  const normalizedAll = evidenceText(evidence)
  const normalizedBody = normalizeText(evidence.text ?? '')
  const diagnostics = new Set<string>()
  const extracted = {
    soil: extractSoil(normalizedBody, diagnostics),
    weatherFields: extractWeatherFields(normalizedBody, evidence.mediaType, diagnostics),
  }

  const plantHits = plantAliasHits(context.plants, evidence.filename, evidence.text ?? '')
  const diseaseHits = diseaseAliasHits(context.diseases, evidence.filename, evidence.text ?? '')
  const plantCandidates = scorePlants(
    context.plants,
    plantHits,
    evidence.visual ?? undefined,
    context.correctionMemory,
  )
  const conflict = detectFilenameConflict(plantHits, normalizedBody)
  if (conflict) {
    diagnostics.add('conflicting-evidence')
    for (const candidate of plantCandidates) {
      if (conflict.filenameOnlyIds.has(candidate.id)) {
        candidate.confidence = Math.min(candidate.confidence, 0.55)
        candidate.level = confidenceLevel(candidate.confidence)
        candidate.warnings.push('Filename mentions this crop, but stronger evidence points elsewhere.')
      }
    }
  }

  const diseaseCandidates = scoreDiseases(
    context.diseases,
    diseaseHits,
    evidence.visual ?? undefined,
    plantCandidates,
  )
  const shape = detectShape(normalizedAll, plantCandidates, diseaseCandidates, extracted, diagnostics)
  const suggestedCropIds = plantCandidates
    .filter(
      (candidate) =>
        candidate.confidence >= 0.5 &&
        !candidate.warnings.some((warning) => warning.includes('stronger evidence')),
    )
    .slice(0, shape === 'mixed-bed' ? 6 : 3)
    .map((candidate) => candidate.id)

  return {
    schemaVersion: 'garden-inference.v2',
    inputId: `input-${stableHash(evidence)}`,
    shape,
    plantCandidates: plantCandidates.slice(0, 6),
    diseaseCandidates: diseaseCandidates.slice(0, 4),
    suggestedCropIds,
    diagnostics: Array.from(diagnostics).sort(),
    extracted,
    provenance: {
      sourceIdentifier: evidence.sourceUrl ?? evidence.filename,
      evidenceHash: stableHash(evidence),
      plantCatalogSize: context.plants.length,
      diseaseCatalogSize: context.diseases.length,
    },
  }
}

export function confidenceLevel(confidence: number) {
  if (confidence >= 0.78) return 'high'
  if (confidence >= 0.5) return 'medium'
  return 'low'
}

function validateEvidence(evidence: GardenEvidence) {
  if (!evidence.filename && !evidence.text) {
    throw inputError(
      'empty-input',
      'There is no garden evidence to analyze.',
      'The planner needs a photo, report text, or weather excerpt before it can infer anything.',
      'Upload a photo or provide the original garden note/report again.',
    )
  }
  const mediaType = evidence.mediaType.toLowerCase()
  if (
    mediaType.includes('heic') ||
    mediaType.includes('heif') ||
    evidence.filename.toLowerCase().endsWith('.heic')
  ) {
    throw inputError(
      'unsupported-format',
      'This phone photo format is not supported in the browser.',
      'HEIC photos often cannot be decoded by the static web app.',
      'Export or share the photo as JPEG or PNG, then upload it again.',
    )
  }
  if (evidence.sizeBytes > MAX_BROWSER_IMAGE_BYTES && mediaType.startsWith('image/')) {
    throw inputError(
      'too-large',
      'This photo is too large for reliable in-browser analysis.',
      'Large phone photos can freeze low-memory devices.',
      'Resize the photo below 15MB or crop to the affected plant area.',
    )
  }
  if (evidence.decodeError) {
    throw inputError(
      'corrupt-image',
      'This photo looks incomplete or corrupted.',
      `The browser reported: ${evidence.decodeError}.`,
      'Upload the original photo again instead of the chat-compressed copy.',
    )
  }
  if (mediaType.startsWith('image/') && !evidence.visual) {
    throw inputError(
      'corrupt-image',
      'The image opened, but no visual signal could be read.',
      'The browser could not decode usable pixels from this file.',
      'Try the original JPEG or PNG, or crop the plant area and upload again.',
    )
  }
}

function scorePlants(
  plants: Plant[],
  hits: ReturnType<typeof plantAliasHits>,
  visual?: VisualSignals,
  correctionMemory?: InferenceContext['correctionMemory'],
) {
  const hitMap = groupHits(hits)
  const preferred = new Set(correctionMemory?.preferredCropIds ?? [])
  return plants
    .map((plant) => {
      let score = 0.08
      const reasons: string[] = []
      const warnings: string[] = []
      const plantHitsForID = hitMap.get(plant.id) ?? []
      for (const hit of plantHitsForID) {
        if (hit.source === 'text') {
          score += 0.42 + Math.min(0.16, Math.max(0, hit.aliases.length - 1) * 0.08)
          reasons.push(`Garden text mentions ${hit.aliases.join(', ')}.`)
        } else {
          score += 0.18
          reasons.push(`Filename mentions ${hit.aliases.join(', ')}.`)
        }
      }
      if (visual) {
        const visualScore = visualPlantScore(plant, visual)
        score += visualScore.score
        if (visualScore.reason) reasons.push(visualScore.reason)
      }
      if (preferred.has(plant.id)) {
        score += 0.12
        reasons.push('Session correction memory favors this crop.')
      }
      if (plantHitsForID.length === 0 && score < 0.35) {
        reasons.push(`Only weak visual evidence matched ${plant.common_name}.`)
      }
      return candidate(plant.id, plant.common_name, score, reasons, warnings)
    })
    .sort(candidateSort)
}

function scoreDiseases(
  diseases: DiseaseSignature[],
  hits: ReturnType<typeof diseaseAliasHits>,
  visual: VisualSignals | undefined,
  plantCandidates: InferenceCandidate[],
) {
  const hitMap = groupHits(hits)
  const likelyHosts = new Set(
    plantCandidates.filter((plant) => plant.confidence >= 0.5).map((plant) => plant.id),
  )
  return diseases
    .map((disease) => {
      let score = 0.06
      const reasons: string[] = []
      const warnings: string[] = []
      for (const hit of hitMap.get(disease.id) ?? []) {
        if (hit.source === 'text') {
          score += 0.44
          reasons.push(`Garden text mentions ${hit.aliases.join(', ')}.`)
        } else {
          score += 0.15
          reasons.push(`Filename mentions ${hit.aliases.join(', ')}.`)
        }
      }
      const visualDisease = visual ? visualDiseaseScore(disease, visual) : null
      if (visualDisease) {
        score += visualDisease.score
        reasons.push(visualDisease.reason)
      }
      const compatibleHost = disease.affected_plants.some((plantID) => likelyHosts.has(plantID))
      if (compatibleHost) {
        score += 0.16
        reasons.push('Likely host crop matches this disease.')
      } else if (likelyHosts.size > 0 && score > 0.52) {
        score = 0.52
        warnings.push('Disease is not a strong match for the likely host crop.')
      }
      if (reasons.length === 0) {
        reasons.push('No strong disease-specific evidence was found.')
      }
      return candidate(disease.id, disease.label, score, reasons, warnings)
    })
    .sort(candidateSort)
}

function visualPlantScore(plant: Plant, visual: VisualSignals) {
  if (plant.id === 'pepper' && visual.greenRatio >= 0.46 && visual.redRatio < 0.28) {
    return { score: 0.12, reason: 'Glossy green canopy is compatible with pepper.' }
  }
  if (plant.rotation_group === 'leafy' && visual.greenRatio >= 0.45) {
    return { score: 0.12, reason: 'Leafy green canopy signal is strong.' }
  }
  if (plant.rotation_group === 'nightshade' && visual.redRatio >= 0.3) {
    return { score: 0.1, reason: 'Warm fruit/lesion colors fit a nightshade crop.' }
  }
  if (plant.id === 'marigold' && visual.yellowRatio && visual.yellowRatio >= 0.14) {
    return { score: 0.1, reason: 'Yellow-orange flower color is compatible with marigold.' }
  }
  if (
    plant.id === 'cucumber' &&
    visual.greenRatio >= 0.38 &&
    visual.whitePatchRatio &&
    visual.whitePatchRatio > 0.18
  ) {
    return { score: 0.1, reason: 'Leaf crop with white patches is compatible with cucumber mildew photos.' }
  }
  return { score: visual.greenRatio >= 0.35 ? 0.04 : 0, reason: '' }
}

function visualDiseaseScore(disease: DiseaseSignature, visual: VisualSignals) {
  if (disease.id === 'powdery-mildew' && (visual.whitePatchRatio ?? 0) >= 0.18) {
    return { score: 0.26, reason: 'White powder-like leaf patches match mildew pressure.' }
  }
  if (
    disease.id === 'early-blight' &&
    (visual.brownSpotRatio ?? 0) >= 0.18 &&
    (visual.yellowRatio ?? 0) >= 0.1
  ) {
    return { score: 0.28, reason: 'Brown spots with yellowing match early blight pressure.' }
  }
  if (
    disease.id === 'downy-mildew' &&
    (visual.yellowRatio ?? 0) >= 0.2 &&
    (visual.whitePatchRatio ?? 0) >= 0.06
  ) {
    return { score: 0.24, reason: 'Angular yellowing and pale underside cues match downy mildew.' }
  }
  if (disease.id === 'rust' && visual.redRatio >= 0.32 && (visual.brownSpotRatio ?? 0) >= 0.12) {
    return { score: 0.18, reason: 'Orange-brown spotting is compatible with rust.' }
  }
  return null
}

function detectShape(
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

function detectFilenameConflict(hits: ReturnType<typeof plantAliasHits>, normalizedBody: string) {
  const filenameIds = new Set(hits.filter((hit) => hit.source === 'filename').map((hit) => hit.id))
  const textIds = new Set(hits.filter((hit) => hit.source === 'text').map((hit) => hit.id))
  const negatedIds = new Set(
    Array.from(filenameIds).filter((id) =>
      aliasesForPlant(id).some((alias) => normalizedBody.includes(`no ${normalizeText(alias)}`)),
    ),
  )
  const filenameOnlyIds = new Set(
    Array.from(filenameIds).filter((id) => !textIds.has(id) || negatedIds.has(id)),
  )
  return filenameOnlyIds.size > 0 && textIds.size > 0 ? { filenameOnlyIds } : null
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

function candidate(
  id: string,
  label: string,
  rawScore: number,
  reasons: string[],
  warnings: string[],
): InferenceCandidate {
  const confidence = roundConfidence(Math.max(0.03, Math.min(0.96, rawScore)))
  return {
    id,
    label,
    confidence,
    level: confidenceLevel(confidence),
    reasons: dedupe(reasons),
    warnings: dedupe(warnings),
  }
}

function candidateSort(left: InferenceCandidate, right: InferenceCandidate) {
  return right.confidence - left.confidence || left.id.localeCompare(right.id)
}

function groupHits<T extends { id: string }>(hits: T[]) {
  const grouped = new Map<string, T[]>()
  for (const hit of hits) {
    grouped.set(hit.id, [...(grouped.get(hit.id) ?? []), hit])
  }
  return grouped
}

function roundConfidence(value: number) {
  return Math.round(value * 100) / 100
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort()
}

export function plantAliasList(id: string) {
  return aliasesForPlant(id)
}
