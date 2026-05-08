import { describe, expect, it } from 'vitest'
import { buildRotationPlan } from './rotation'
import type { Plant } from '../types/domain'

const plants = [
  { id: 'bean', common_name: 'Bean', rotation_group: 'legume' },
  { id: 'lettuce', common_name: 'Lettuce', rotation_group: 'leafy' },
  { id: 'carrot', common_name: 'Carrot', rotation_group: 'root' },
] as Plant[]

describe('buildRotationPlan', () => {
  it('suggests four future seasons away from the current group', () => {
    const plan = buildRotationPlan(plants, ['bean'])

    expect(plan).toHaveLength(4)
    expect(plan[0].rotationGroup).not.toBe('legume')
    expect(plan[0].season).toBe('Season 1')
  })
})
