import { describe, expect, test } from 'vitest'
import { defaultGardenPlan } from './planModel'
import { decodeShareHash, encodeShareHash, parseGardenState, serializeGardenState } from './planIO'

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
