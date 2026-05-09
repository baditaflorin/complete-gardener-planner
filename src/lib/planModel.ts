import { z } from 'zod'
import type { GardenPlan, Plant, SoilCell } from '../types/domain'

export const defaultGardenPlan: GardenPlan = {
  name: 'Balcony and raised-bed mix',
  selectedCropIds: ['tomato', 'basil', 'lettuce', 'bean'],
  frostZoneId: 'eu-6b',
  soilCellId: 'loam-urban-001',
  latitude: 45.76,
  longitude: 21.23,
  bedAreaSqm: 7.5,
  shadePercent: 18,
  diseasePressure: 0.18,
  plantingDateISO: '2026-05-15',
}

export const gardenPlanSchema = z.object({
  name: z.string().trim().min(1),
  selectedCropIds: z.array(z.string().trim().min(1)),
  frostZoneId: z.string().trim().min(1),
  soilCellId: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  bedAreaSqm: z.number().min(0.5).max(10000),
  shadePercent: z.number().min(0).max(95),
  diseasePressure: z.number().min(0).max(1),
  plantingDateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

const partialGardenPlanSchema = gardenPlanSchema.partial()

export function normalizeGardenPlan(value: unknown): GardenPlan {
  const parsed = partialGardenPlanSchema.safeParse(value)
  if (!parsed.success) {
    throw new Error('The garden plan file is not shaped like a Complete Gardener Planner state file.')
  }
  const merged = {
    ...defaultGardenPlan,
    ...parsed.data,
    selectedCropIds: stableUnique(parsed.data.selectedCropIds ?? defaultGardenPlan.selectedCropIds),
  }
  return gardenPlanSchema.parse({
    ...merged,
    bedAreaSqm: clampNumber(merged.bedAreaSqm, 0.5, 10000, defaultGardenPlan.bedAreaSqm),
    shadePercent: clampNumber(merged.shadePercent, 0, 95, defaultGardenPlan.shadePercent),
    diseasePressure: clampNumber(merged.diseasePressure, 0, 1, defaultGardenPlan.diseasePressure),
  })
}

export function toggleCrop(plan: GardenPlan, cropId: string): GardenPlan {
  const selected = new Set(plan.selectedCropIds)
  if (selected.has(cropId)) {
    selected.delete(cropId)
  } else {
    selected.add(cropId)
  }
  return { ...plan, selectedCropIds: Array.from(selected).sort() }
}

export function withSuggestedCrops(plan: GardenPlan, cropIds: string[]): GardenPlan {
  return { ...plan, selectedCropIds: stableUnique([...plan.selectedCropIds, ...cropIds]) }
}

export function parseBoundedNumber(value: string, min: number, max: number, fallback: number) {
  const parsed = Number.parseFloat(value)
  return clampNumber(parsed, min, max, fallback)
}

export function labelForPlant(plants: Pick<Plant, 'id' | 'common_name'>[], id: string) {
  return plants.find((plant) => plant.id === id)?.common_name ?? id
}

export function nearestSoilCell<T extends Pick<SoilCell, 'latitude' | 'longitude'>>(
  cells: T[] | undefined,
  latitude: number,
  longitude: number,
) {
  return [...(cells ?? [])].sort((left, right) => {
    const leftDistance = Math.hypot(left.latitude - latitude, left.longitude - longitude)
    const rightDistance = Math.hypot(right.latitude - latitude, right.longitude - longitude)
    return leftDistance - rightDistance
  })[0]
}

function stableUnique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort()
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, value))
}
