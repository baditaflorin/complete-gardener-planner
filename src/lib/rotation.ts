import type { CompanionEdge, Plant } from '../types/domain'

export type RotationStep = {
  season: string
  cropName: string
  rotationGroup: string
  reason: string
}

const sequence = ['legume', 'leafy', 'fruiting', 'root', 'flower', 'cucurbit', 'nightshade']

export function buildRotationPlan(plants: Plant[], selectedIds: string[]): RotationStep[] {
  const selected = selectedIds.map((id) => plants.find((plant) => plant.id === id)).filter(isPlant)
  const lastGroup = selected.at(0)?.rotation_group ?? 'leafy'
  const start = Math.max(
    sequence.findIndex((group) => lastGroup.includes(group)),
    0,
  )

  return Array.from({ length: 4 }, (_, index) => {
    const group = sequence[(start + index + 1) % sequence.length]
    const crop = plants.find((plant) => plant.rotation_group.includes(group)) ?? plants[index % plants.length]
    return {
      season: `Season ${index + 1}`,
      cropName: crop.common_name,
      rotationGroup: crop.rotation_group,
      reason:
        crop.rotation_group === lastGroup
          ? 'Use only if bed constraints force it; add compost and monitor disease pressure.'
          : `Moves away from ${lastGroup} pressure and keeps nutrient demand varied.`,
    }
  })
}

export function companionSummary(companions: CompanionEdge[], selectedIds: string[]) {
  const set = new Set(selectedIds)
  return companions.filter((edge) => set.has(edge.source_id) || set.has(edge.target_id))
}

function isPlant(value: Plant | undefined): value is Plant {
  return Boolean(value)
}
