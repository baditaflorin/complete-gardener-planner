import type { CorrectionMemory } from './types'

let memory: CorrectionMemory = { preferredCropIds: [] }

export function rememberCropCorrection(cropIds: string[]) {
  memory = { preferredCropIds: Array.from(new Set(cropIds)).sort() }
}

export function currentCorrectionMemory(): CorrectionMemory {
  return memory
}

export function resetCorrectionMemory() {
  memory = { preferredCropIds: [] }
}
