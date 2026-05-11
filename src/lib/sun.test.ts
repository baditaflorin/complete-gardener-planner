import { describe, expect, it } from 'vitest'
import { averageSunHours, buildSunMap } from './sun'

const BUCHAREST_LAT = 44.4268
const BUCHAREST_LON = 26.1025
const TROMSO_LAT = 69.6492
const TROMSO_LON = 18.9553

describe('buildSunMap', () => {
  it('returns 15 hourly cells starting at 05:00', () => {
    const cells = buildSunMap(BUCHAREST_LAT, BUCHAREST_LON, '2026-06-21T00:00:00Z', 0)
    expect(cells).toHaveLength(15)
    expect(cells[0].hour).toBe(5)
    expect(cells[cells.length - 1].hour).toBe(19)
  })

  it('peaks near solar noon for a mid-latitude summer day', () => {
    const cells = buildSunMap(BUCHAREST_LAT, BUCHAREST_LON, '2026-06-21T00:00:00Z', 0)
    const peak = cells.reduce((best, cell) => (cell.intensity > best.intensity ? cell : best))
    // Bucharest sits ~UTC+2 in summer, so solar noon clocks around 13:00 local.
    expect(peak.hour).toBeGreaterThanOrEqual(12)
    expect(peak.hour).toBeLessThanOrEqual(14)
    expect(peak.intensity).toBeGreaterThan(0.7)
  })

  it('returns all zeros during polar night', () => {
    // Tromsø in late December: sun never rises above the horizon.
    const cells = buildSunMap(TROMSO_LAT, TROMSO_LON, '2026-12-22T00:00:00Z', 0)
    for (const cell of cells) {
      expect(cell.intensity).toBe(0)
    }
  })

  it('keeps a nontrivial midday value during polar day', () => {
    // Tromsø in late June: sun never sets. The map only covers 05:00–19:00,
    // so we should still see positive midday intensities even without a
    // sunrise/sunset cycle in that window.
    const cells = buildSunMap(TROMSO_LAT, TROMSO_LON, '2026-06-21T00:00:00Z', 0)
    const peak = cells.reduce((best, cell) => (cell.intensity > best.intensity ? cell : best))
    expect(peak.intensity).toBeGreaterThan(0)
  })

  it('attenuates by the shade fraction', () => {
    const unshaded = buildSunMap(BUCHAREST_LAT, BUCHAREST_LON, '2026-06-21T00:00:00Z', 0)
    const shaded = buildSunMap(BUCHAREST_LAT, BUCHAREST_LON, '2026-06-21T00:00:00Z', 50)
    const peakUnshaded = Math.max(...unshaded.map((cell) => cell.intensity))
    const peakShaded = Math.max(...shaded.map((cell) => cell.intensity))
    // 50% shade should approximately halve the peak (rounding to 0.01).
    expect(peakShaded).toBeCloseTo(peakUnshaded * 0.5, 1)
  })

  it('produces a higher average sun budget in summer than winter at mid latitude', () => {
    const summer = averageSunHours(buildSunMap(BUCHAREST_LAT, BUCHAREST_LON, '2026-06-21T00:00:00Z', 0))
    const winter = averageSunHours(buildSunMap(BUCHAREST_LAT, BUCHAREST_LON, '2026-12-21T00:00:00Z', 0))
    expect(summer).toBeGreaterThan(winter)
  })
})
