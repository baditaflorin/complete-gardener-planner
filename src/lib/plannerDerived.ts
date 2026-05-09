import { averageSunHours, buildSunMap } from './sun'
import { buildRotationPlan, companionSummary } from './rotation'
import { calculateWateringSchedule } from './irrigation'
import { projectHarvests } from './yield'
import type { GardenPlan, StaticData } from '../types/domain'

export function derivePlannerOutputs(data: StaticData, plan: GardenPlan) {
  const selectedPlants = data.plants.filter((plant) => plan.selectedCropIds.includes(plant.id))
  const frostZone = data.frost.find((zone) => zone.zone_id === plan.frostZoneId) ?? data.frost[0]
  const soil = data.soilCells.find((cell) => cell.id === plan.soilCellId) ?? data.soilCells[0]
  const weather =
    data.weatherNormals.find((normal) => normal.zone_id === plan.frostZoneId) ?? data.weatherNormals[0]
  const monthIndex = Math.max(0, new Date(plan.plantingDateISO).getMonth())
  const sunCells = buildSunMap(plan.latitude, plan.longitude, plan.plantingDateISO, plan.shadePercent)
  const sunHours = averageSunHours(sunCells)
  const rotation = buildRotationPlan(data.plants, plan.selectedCropIds)
  const companions = companionSummary(data.companions, plan.selectedCropIds)
  const watering = calculateWateringSchedule({
    plants: data.plants,
    selectedIds: plan.selectedCropIds,
    soil,
    weather,
    bedAreaSqm: plan.bedAreaSqm,
    monthIndex,
  })
  const harvests = projectHarvests({
    plants: data.plants,
    selectedIds: plan.selectedCropIds,
    model: data.yieldModel,
    soil,
    bedAreaSqm: plan.bedAreaSqm,
    plantingDateISO: plan.plantingDateISO,
    sunHours,
    waterBalanceMM: watering.weeklyNeedMM,
    diseasePressure: plan.diseasePressure,
  })

  return {
    selectedPlants,
    frostZone,
    soil,
    weather,
    monthIndex,
    sunCells,
    sunHours,
    rotation,
    companions,
    watering,
    harvests,
  }
}

export type PlannerOutputs = ReturnType<typeof derivePlannerOutputs>
