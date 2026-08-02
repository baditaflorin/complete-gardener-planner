import { describe, expect, test } from 'vitest'
import { defaultGardenPlan } from './planModel'
import {
  decodeShareHash,
  encodeShareHash,
  parseGardenState,
  resolveInitialPlan,
  serializeGardenState,
} from './planIO'

describe('garden state import/export', () => {
  test('round-trips a versioned state envelope', () => {
    const serialized = serializeGardenState(defaultGardenPlan)
    expect(parseGardenState(serialized)).toEqual({
      ...defaultGardenPlan,
      selectedCropIds: [...defaultGardenPlan.selectedCropIds].sort(),
    })
  })

  test('migrates an old raw plan', () => {
    const imported = parseGardenState(JSON.stringify({ name: 'Old bed', selectedCropIds: ['tomato'] }))
    expect(imported.name).toBe('Old bed')
    expect(imported.selectedCropIds).toEqual(['tomato'])
    expect(imported.frostZoneId).toBe(defaultGardenPlan.frostZoneId)
  })

  test('encodes and decodes a share hash', () => {
    const hash = encodeShareHash(defaultGardenPlan)
    expect(decodeShareHash(`#${hash}`)).toEqual({
      ...defaultGardenPlan,
      selectedCropIds: [...defaultGardenPlan.selectedCropIds].sort(),
    })
  })
})

describe('resolveInitialPlan', () => {
  const storedPlan = { ...defaultGardenPlan, name: 'My saved bed' }

  test('falls back to the stored local plan when there is no share hash', () => {
    const resolution = resolveInitialPlan('', storedPlan)
    expect(resolution.plan).toEqual(storedPlan)
    expect(resolution.statusMessage).toBe('Saved locally in this browser')
    expect(resolution.shouldClearShareHash).toBe(false)
  })

  test('falls back to the stored local plan when the hash is invalid', () => {
    const resolution = resolveInitialPlan('#garden=not-valid-base64!!', storedPlan)
    expect(resolution.plan).toEqual(storedPlan)
    expect(resolution.shouldClearShareHash).toBe(false)
  })

  test('prefers a valid shared plan and flags that the hash must be cleared', () => {
    const sharedSource = { ...defaultGardenPlan, name: 'Shared from a friend' }
    const hash = `#${encodeShareHash(sharedSource)}`

    const resolution = resolveInitialPlan(hash, storedPlan)

    expect(resolution.plan.name).toBe('Shared from a friend')
    expect(resolution.statusMessage).toBe('Loaded shared plan from URL')
    // Regression guard: if the caller does not clear the hash after this,
    // reloading the tab keeps re-applying this same shared snapshot forever,
    // silently discarding any local edits made after the first load.
    expect(resolution.shouldClearShareHash).toBe(true)
  })
})
