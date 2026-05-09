import { openDB } from 'idb'
import type { GardenPlan } from '../types/domain'
import { createGardenStateEnvelope, parseGardenState } from './planIO'
import { defaultGardenPlan } from './planModel'

const DB_NAME = 'complete-gardener-planner'
const STORE = 'garden-plans'

async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      database.createObjectStore(STORE)
    },
  })
}

export async function loadGardenPlan(): Promise<GardenPlan> {
  const database = await db()
  const stored = await database.get(STORE, 'active')
  if (!stored) {
    return defaultGardenPlan
  }
  try {
    return parseGardenState(stored)
  } catch {
    return defaultGardenPlan
  }
}

export async function saveGardenPlan(plan: GardenPlan): Promise<void> {
  const database = await db()
  await database.put(STORE, createGardenStateEnvelope(plan), 'active')
}

export async function clearGardenPlan(): Promise<void> {
  const database = await db()
  await database.delete(STORE, 'active')
}
