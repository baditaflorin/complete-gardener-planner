import { describe, expect, it } from 'vitest'
import { calculateWateringSchedule } from './irrigation'
import type { Plant, SoilCell, WeatherNormal } from '../types/domain'

const plant: Plant = {
  id: 'tomato',
  common_name: 'Tomato',
  scientific_name: 'Solanum lycopersicum',
  family: 'Solanaceae',
  guild: 'fruiting annual',
  usda_zones: [7],
  eu_hardiness: 'H3',
  days_to_harvest: 78,
  water_mm_per_week: 34,
  sun_hours_min: 7,
  sun_hours_max: 10,
  rotation_group: 'nightshade',
  soil_ph_min: 6,
  soil_ph_max: 6.8,
  planting_months: ['May'],
  harvest_months: ['Aug'],
  disease_risks: ['early-blight'],
  companion_boost_ids: ['basil'],
}

const soil: SoilCell = {
  id: 'soil',
  label: 'Soil',
  latitude: 1,
  longitude: 1,
  texture: 'loam',
  organic_matter_pc: 5,
  ph: 6.6,
  drainage: 'balanced',
  water_holding_mm: 42,
  source: 'test',
}

const weather: WeatherNormal = {
  zone_id: 'zone',
  label: 'Zone',
  monthly_rain_mm: Array(12).fill(40),
  monthly_et0_mm: Array(12).fill(100),
  monthly_temp_c: Array(12).fill(20),
  cache_policy: 'test',
  source_summary: 'test',
}

describe('calculateWateringSchedule', () => {
  it('turns crop demand, soil, weather, and area into a weekly schedule', () => {
    const schedule = calculateWateringSchedule({
      plants: [plant],
      selectedIds: ['tomato'],
      soil,
      weather,
      bedAreaSqm: 5,
      monthIndex: 6,
    })

    expect(schedule.litersPerWeek).toBeGreaterThan(80)
    expect(schedule.eventsPerWeek).toBe(3)
    expect(schedule.minutesPerEvent).toBeGreaterThan(5)
  })
})
