import { describe, expect, it } from 'vitest'
import { projectHarvests } from './yield'
import type { Plant, SoilCell, YieldModel } from '../types/domain'

const plant = {
  id: 'tomato',
  common_name: 'Tomato',
  days_to_harvest: 70,
} as Plant

const soil = {
  organic_matter_pc: 5,
} as SoilCell

const model: YieldModel = {
  schema_version: '1',
  model_kind: 'linear',
  features: [],
  coefficients: {
    sun_hours: 0.08,
    water_balance_mm: 0.01,
    soil_organic_matter_pc: 0.06,
    days_in_ground: 0.01,
    disease_pressure: -0.1,
  },
  intercept: 0.5,
  mae_percent: 12,
  training_rows: 10,
  notes: 'test',
}

describe('projectHarvests', () => {
  it('projects crop yield and harvest date', () => {
    const [projection] = projectHarvests({
      plants: [plant],
      selectedIds: ['tomato'],
      model,
      soil,
      bedAreaSqm: 4,
      plantingDateISO: '2026-05-01',
      sunHours: 7,
      waterBalanceMM: 15,
      diseasePressure: 0.2,
    })

    expect(projection.harvestDateISO).toBe('2026-07-10')
    expect(projection.yieldKg).toBeGreaterThan(8)
    expect(projection.confidence).toBe('good')
  })
})
