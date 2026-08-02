import type { CompanionEdge, Plant } from '../types/domain'

export type RotationStep = {
  season: string
  cropName: string
  rotationGroup: string
  reason: string
}

const sequence = ['legume', 'leafy', 'fruiting', 'root', 'flower', 'cucurbit', 'nightshade']
const SEASON_COUNT = 4

export function buildRotationPlan(plants: Plant[], selectedIds: string[]): RotationStep[] {
  const selected = selectedIds.map((id) => plants.find((plant) => plant.id === id)).filter(isPlant)
  // Consider every currently-selected crop's family, not just one of them.
  // Picking a single "representative" crop (e.g. selected[0]) is arbitrary
  // whenever the caller's id list has been sorted alphabetically (as
  // planModel.toggleCrop and normalizeGardenPlan both do) - which family ends
  // up "current" then depends on crop id spelling, not on what's actually
  // growing. That let the planner suggest replanting a family that is
  // literally still in the bed (e.g. nightshade) while telling the gardener
  // it was "moving away" from an unrelated family that merely sorted first.
  const currentGroups =
    selected.length > 0 ? dedupe(selected.map((plant) => plant.rotation_group)) : ['leafy']
  const usedIndexes = new Set(currentGroups.map(groupIndex))
  const anchor = Math.max(...Array.from(usedIndexes))

  const order = buildRotationOrder(anchor, usedIndexes)

  return Array.from({ length: SEASON_COUNT }, (_, index) => {
    const group = sequence[order[index]]
    const crop = plants.find((plant) => plant.rotation_group.includes(group)) ?? plants[index % plants.length]
    // Judge "repeats a current family" against the crop actually returned,
    // not the target group we searched for: when the catalog has no plant
    // for that target group, the fallback above can hand back a crop whose
    // real family is one already in the bed, and the reason text must
    // reflect that instead of falsely claiming the plan "moves away".
    const repeatsCurrentFamily = usedIndexes.has(groupIndex(crop.rotation_group))
    return {
      season: `Season ${index + 1}`,
      cropName: crop.common_name,
      rotationGroup: crop.rotation_group,
      reason: repeatsCurrentFamily
        ? `Repeats a family already in this bed (${currentGroups.join(', ')}); use only if bed constraints force it, and add compost while monitoring disease pressure.`
        : `Moves away from ${currentGroups.join(', ')} pressure and keeps nutrient demand varied.`,
    }
  })
}

// Returns SEASON_COUNT sequence indexes, cycling forward from the anchor.
// Groups that are not currently occupying the bed are exhausted first; only
// once every unused family has been offered does the rotation fall back to
// repeating a currently-used family (flagged via repeatsCurrentFamily above).
function buildRotationOrder(anchor: number, usedIndexes: Set<number>): number[] {
  const order: number[] = []
  const maxOffset = sequence.length * 2
  for (let offset = 1; order.length < SEASON_COUNT && offset <= maxOffset; offset += 1) {
    const candidate = (anchor + offset) % sequence.length
    if (!usedIndexes.has(candidate) && !order.includes(candidate)) {
      order.push(candidate)
    }
  }
  for (let offset = 1; order.length < SEASON_COUNT && offset <= maxOffset; offset += 1) {
    order.push((anchor + offset) % sequence.length)
  }
  return order
}

function groupIndex(group: string) {
  const index = sequence.findIndex((candidate) => group.includes(candidate))
  return index === -1 ? 0 : index
}

function dedupe(values: string[]) {
  return Array.from(new Set(values))
}

export function companionSummary(companions: CompanionEdge[], selectedIds: string[]) {
  const set = new Set(selectedIds)
  return companions.filter((edge) => set.has(edge.source_id) || set.has(edge.target_id))
}

function isPlant(value: Plant | undefined): value is Plant {
  return Boolean(value)
}
