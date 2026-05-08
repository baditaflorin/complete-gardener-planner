import type { Plant, SoilCell, WeatherNormal } from '../types/domain'

export type WateringSchedule = {
  weeklyNeedMM: number
  irrigationMM: number
  litersPerWeek: number
  eventsPerWeek: number
  minutesPerEvent: number
  note: string
}

export function calculateWateringSchedule(params: {
  plants: Plant[]
  selectedIds: string[]
  soil: SoilCell
  weather: WeatherNormal
  bedAreaSqm: number
  monthIndex: number
}): WateringSchedule {
  const selected = params.selectedIds
    .map((id) => params.plants.find((plant) => plant.id === id))
    .filter((plant): plant is Plant => Boolean(plant))
  const averageNeed =
    selected.reduce((sum, plant) => sum + plant.water_mm_per_week, 0) / Math.max(selected.length, 1)
  const rainPerWeek = params.weather.monthly_rain_mm[params.monthIndex] / 4.345
  const etPressure = params.weather.monthly_et0_mm[params.monthIndex] / 4.345
  const soilBuffer = params.soil.water_holding_mm / 30
  const weeklyNeedMM = Math.max(8, averageNeed + etPressure * 0.18 - rainPerWeek - soilBuffer)
  const eventsPerWeek = params.soil.drainage === 'fast' ? 4 : params.soil.drainage === 'slow' ? 2 : 3
  const litersPerWeek = weeklyNeedMM * params.bedAreaSqm
  const minutesPerEvent = litersPerWeek / eventsPerWeek / 4

  return {
    weeklyNeedMM: round(weeklyNeedMM),
    irrigationMM: round(weeklyNeedMM),
    litersPerWeek: round(litersPerWeek),
    eventsPerWeek,
    minutesPerEvent: round(minutesPerEvent),
    note:
      weeklyNeedMM < 12
        ? 'Rain and soil storage cover much of this week.'
        : 'Use deep watering and re-check after hot or windy days.',
  }
}

function round(value: number) {
  return Math.round(value * 10) / 10
}
