import SunCalc from 'suncalc'

export type SunCell = {
  hour: number
  label: string
  intensity: number
}

export function buildSunMap(
  latitude: number,
  longitude: number,
  dateISO: string,
  shadePercent: number,
): SunCell[] {
  const date = new Date(dateISO)
  const times = SunCalc.getTimes(date, latitude, longitude)
  const sunrise = times.sunrise.getHours() + times.sunrise.getMinutes() / 60
  const sunset = times.sunset.getHours() + times.sunset.getMinutes() / 60
  const shade = Math.min(Math.max(shadePercent, 0), 90) / 100

  return Array.from({ length: 15 }, (_, index) => {
    const hour = index + 5
    const daylight = hour >= sunrise && hour <= sunset
    const solarNoonDistance = Math.abs(hour - 13)
    const raw = daylight ? Math.max(0.15, 1 - solarNoonDistance / 8) : 0
    return {
      hour,
      label: `${hour}:00`,
      intensity: Math.round(raw * (1 - shade) * 100) / 100,
    }
  })
}

export function averageSunHours(cells: SunCell[]) {
  return Math.round(cells.reduce((sum, cell) => sum + cell.intensity, 0) * 10) / 10
}
