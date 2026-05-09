import type { DiseaseSignature, Plant } from '../../types/domain'
import { normalizeText } from './normalize'

const plantAliases: Record<string, string[]> = {
  tomato: ['tomato', 'tomatoes', 'solanum lycopersicum', 'cherry tomato', 'roma tomato'],
  basil: ['basil', 'ocimum basilicum', 'sweet basil'],
  lettuce: ['lettuce', 'lactuca sativa', 'salad greens', 'leaf lettuce'],
  carrot: ['carrot', 'carrots', 'daucus carota'],
  bean: ['bean', 'beans', 'bush bean', 'phaseolus vulgaris'],
  marigold: ['marigold', 'marigolds', 'tagetes'],
  pepper: ['pepper', 'peppers', 'capsicum', 'capsicum annuum', 'chilli', 'chili'],
  cucumber: ['cucumber', 'cucumbers', 'cucumis sativus'],
}

const diseaseAliases: Record<string, string[]> = {
  'powdery-mildew': ['powdery mildew', 'white powder', 'sphaerotheca', 'oidium'],
  'early-blight': ['early blight', 'brown concentric', 'target spots', 'yellow halo', 'lower leaves'],
  'downy-mildew': ['downy mildew', 'gray underside fuzz', 'underside fuzz', 'angular yellow lesions'],
  rust: ['rust', 'orange pustules', 'bean rust'],
  'leaf-blight': ['leaf blight'],
  'bacterial-spot': ['bacterial spot'],
  botrytis: ['botrytis', 'gray mold'],
  'aphid-pressure': ['aphid', 'aphids'],
}

export type VocabularyHit = {
  id: string
  aliases: string[]
  source: 'filename' | 'text'
}

export function plantAliasHits(plants: Plant[], filename: string, text: string) {
  return aliasHits(
    plants.map((plant) => plant.id),
    plantAliases,
    filename,
    text,
  )
}

export function diseaseAliasHits(diseases: DiseaseSignature[], filename: string, text: string) {
  return aliasHits(
    diseases.map((disease) => disease.id),
    diseaseAliases,
    filename,
    text,
  )
}

export function aliasesForPlant(id: string) {
  return plantAliases[id] ?? [id]
}

function aliasHits(
  ids: string[],
  aliases: Record<string, string[]>,
  filename: string,
  text: string,
): VocabularyHit[] {
  const normalizedFilename = normalizeText(filename)
  const normalizedText = normalizeText(text)
  return ids.flatMap((id) => {
    const matchedFilename = (aliases[id] ?? [id]).filter((alias) =>
      normalizedFilename.includes(normalizeText(alias)),
    )
    const matchedText = (aliases[id] ?? [id]).filter((alias) => normalizedText.includes(normalizeText(alias)))
    return [
      ...(matchedFilename.length > 0 ? [{ id, aliases: matchedFilename, source: 'filename' as const }] : []),
      ...(matchedText.length > 0 ? [{ id, aliases: matchedText, source: 'text' as const }] : []),
    ]
  })
}
