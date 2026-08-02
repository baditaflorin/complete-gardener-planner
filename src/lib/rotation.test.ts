import { describe, expect, it } from 'vitest'
import { buildRotationPlan } from './rotation'
import type { Plant } from '../types/domain'

const plants = [
  { id: 'bean', common_name: 'Bean', rotation_group: 'legume' },
  { id: 'lettuce', common_name: 'Lettuce', rotation_group: 'leafy' },
  { id: 'carrot', common_name: 'Carrot', rotation_group: 'root' },
  { id: 'marigold', common_name: 'Marigold', rotation_group: 'flower' },
  { id: 'tomato', common_name: 'Tomato', rotation_group: 'nightshade' },
] as Plant[]

describe('buildRotationPlan', () => {
  it('suggests four future seasons away from the current group', () => {
    const plan = buildRotationPlan(plants, ['bean'])

    expect(plan).toHaveLength(4)
    expect(plan[0].rotationGroup).not.toBe('legume')
    expect(plan[0].season).toBe('Season 1')
  })

  it('avoids every family currently in the bed, not just one arbitrary selected crop', () => {
    // Regression test: the previous implementation anchored on
    // `selectedIds.at(0)` only. Because callers keep selectedCropIds sorted
    // alphabetically, 'marigold' sorts before 'tomato', so the old code used
    // only marigold's group ('flower') as "the current group" and ignored
    // that tomato (nightshade) is also currently planted. That could and did
    // recommend replanting nightshade - the exact family still in the bed -
    // while labeling it "moves away from flower pressure".
    const plan = buildRotationPlan(plants, ['marigold', 'tomato'])

    for (const step of plan) {
      if (step.rotationGroup === 'nightshade' || step.rotationGroup === 'flower') {
        expect(step.reason).toContain('Repeats a family already in this bed')
      } else {
        expect(step.reason.startsWith('Moves away from')).toBe(true)
      }
    }
    // With 5 catalog families unused (legume, leafy, fruiting, root, cucurbit)
    // and only 4 seasons requested, none of them need to repeat a current family.
    expect(plan.every((step) => step.rotationGroup !== 'nightshade' && step.rotationGroup !== 'flower')).toBe(
      true,
    )
  })

  it('falls back to repeating a current family only once every other family has been offered', () => {
    const narrowCatalog = [
      { id: 'bean', common_name: 'Bean', rotation_group: 'legume' },
      { id: 'tomato', common_name: 'Tomato', rotation_group: 'nightshade' },
    ] as Plant[]

    const plan = buildRotationPlan(narrowCatalog, ['bean', 'tomato'])

    expect(plan).toHaveLength(4)
    // Only two families exist in the whole catalog and both are already
    // planted, so every suggestion must legitimately repeat one of them - but
    // it must say so honestly instead of claiming to "move away".
    for (const step of plan) {
      expect(step.reason).toContain('Repeats a family already in this bed')
    }
  })
})
