import SunCalc from 'suncalc'

export type SunCell = {
  hour: number
  label: string
  intensity: number
}

const HOUR_START = 5
const HOUR_COUNT = 15

// buildSunMap returns hourly relative solar intensity (0..1) across the day,
// computed from real sun altitude via SunCalc.getPosition. The previous
// implementation only used SunCalc for sunrise/sunset and then faked intensity
// with a hardcoded 13:00 solar-noon triangular falloff — wrong for any
// longitude that isn't centered in its timezone, wrong near the solstices,
// and wrong above the Arctic Circle where sunrise/sunset can be NaN.
//
// Polar nights (sun never rises) produce all-zero cells; polar days (sun never
// sets) produce a full sin-of-altitude curve with no daylight gating.
export function buildSunMap(
  latitude: number,
  longitude: number,
  dateISO: string,
  shadePercent: number,
): SunCell[] {
  const baseDate = new Date(dateISO)
  const shade = Math.min(Math.max(shadePercent, 0), 90) / 100

  return Array.from({ length: HOUR_COUNT }, (_, index) => {
    const hour = index + HOUR_START
    const sampleDate = new Date(baseDate)
    sampleDate.setHours(hour, 0, 0, 0)
    const position = SunCalc.getPosition(sampleDate, latitude, longitude)
    // altitude is in radians; sin(altitude) is the cosine of the zenith angle
    // and is the standard normalized solar irradiance at a horizontal surface.
    const altitudeIntensity = Math.max(0, Math.sin(position.altitude))
    return {
      hour,
      label: `${hour}:00`,
      intensity: Math.round(altitudeIntensity * (1 - shade) * 100) / 100,
    }
  })
}

export function averageSunHours(cells: SunCell[]) {
  return Math.round(cells.reduce((sum, cell) => sum + cell.intensity, 0) * 10) / 10
}
