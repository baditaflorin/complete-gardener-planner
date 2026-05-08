import type { Plant, SoilCell, YieldModel } from '../types/domain'

export type HarvestProjection = {
  plantId: string
  cropName: string
  harvestDateISO: string
  yieldKg: number
  confidence: string
}

export function projectHarvests(params: {
  plants: Plant[]
  selectedIds: string[]
  model: YieldModel
  soil: SoilCell
  bedAreaSqm: number
  plantingDateISO: string
  sunHours: number
  waterBalanceMM: number
  diseasePressure: number
}): HarvestProjection[] {
  const selected = params.selectedIds
    .map((id) => params.plants.find((plant) => plant.id === id))
    .filter((plant): plant is Plant => Boolean(plant))
  const areaPerCrop = params.bedAreaSqm / Math.max(selected.length, 1)

  return selected.map((plant) => {
    const daysInGround = plant.days_to_harvest
    const score =
      params.model.intercept +
      params.sunHours * (params.model.coefficients.sun_hours ?? 0) +
      params.waterBalanceMM * (params.model.coefficients.water_balance_mm ?? 0) +
      params.soil.organic_matter_pc * (params.model.coefficients.soil_organic_matter_pc ?? 0) +
      daysInGround * (params.model.coefficients.days_in_ground ?? 0) +
      params.diseasePressure * (params.model.coefficients.disease_pressure ?? 0)
    const yieldKgPerSqm = Math.max(0.4, score)
    const harvest = new Date(params.plantingDateISO)
    harvest.setDate(harvest.getDate() + plant.days_to_harvest)

    return {
      plantId: plant.id,
      cropName: plant.common_name,
      harvestDateISO: harvest.toISOString().slice(0, 10),
      yieldKg: Math.round(yieldKgPerSqm * areaPerCrop * 10) / 10,
      confidence: params.model.mae_percent <= 15 ? 'good' : 'directional',
    }
  })
}
