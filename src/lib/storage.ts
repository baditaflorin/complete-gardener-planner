import { openDB } from 'idb'
import type { GardenPlan } from '../types/domain'

const DB_NAME = 'complete-gardener-planner'
const STORE = 'garden-plans'

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

async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      database.createObjectStore(STORE)
    },
  })
}

export async function loadGardenPlan(): Promise<GardenPlan> {
  const database = await db()
  return (await database.get(STORE, 'active')) ?? defaultGardenPlan
}

export async function saveGardenPlan(plan: GardenPlan): Promise<void> {
  const database = await db()
  await database.put(STORE, plan, 'active')
}
