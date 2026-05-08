import { useQuery } from '@tanstack/react-query'
import {
  companionSchema,
  diseaseSchema,
  frostSchema,
  metaSchema,
  plantSchema,
  soilCellSchema,
  weatherNormalSchema,
  yieldModelSchema,
} from './dataSchemas'
import type { StaticData } from '../types/domain'

const base = import.meta.env.BASE_URL

async function fetchJson<T>(path: string, parse: (value: unknown) => T): Promise<T> {
  const response = await fetch(`${base}data/v1/${path}`)
  if (!response.ok) {
    throw new Error(`Could not load ${path}: ${response.status}`)
  }
  return parse(await response.json())
}

async function fetchMeta(path: string) {
  return fetchJson(path, (value) => metaSchema.parse(value))
}

export async function loadStaticData(): Promise<StaticData> {
  const [
    plants,
    companions,
    frost,
    soilCells,
    weatherNormals,
    diseases,
    yieldModel,
    plantsMeta,
    companionsMeta,
    frostMeta,
    soilMeta,
    weatherMeta,
    diseaseMeta,
    yieldMeta,
  ] = await Promise.all([
    fetchJson('plants.json', (value) => plantSchema.array().parse(value)),
    fetchJson('companions.json', (value) => companionSchema.array().parse(value)),
    fetchJson('frost.json', (value) => frostSchema.array().parse(value)),
    fetchJson('soil-cells.json', (value) => soilCellSchema.array().parse(value)),
    fetchJson('weather-normals.json', (value) => weatherNormalSchema.array().parse(value)),
    fetchJson('disease-signatures.json', (value) => diseaseSchema.array().parse(value)),
    fetchJson('yield-model.json', (value) => yieldModelSchema.parse(value)),
    fetchMeta('plants.meta.json'),
    fetchMeta('companions.meta.json'),
    fetchMeta('frost.meta.json'),
    fetchMeta('soil-cells.meta.json'),
    fetchMeta('weather-normals.meta.json'),
    fetchMeta('disease-signatures.meta.json'),
    fetchMeta('yield-model.meta.json'),
  ])

  return {
    plants,
    companions,
    frost,
    soilCells,
    weatherNormals,
    diseases,
    yieldModel,
    meta: {
      plants: plantsMeta,
      companions: companionsMeta,
      frost: frostMeta,
      soilCells: soilMeta,
      weatherNormals: weatherMeta,
      diseases: diseaseMeta,
      yieldModel: yieldMeta,
    },
  }
}

export function useStaticData() {
  return useQuery({
    queryKey: ['static-data', 'v1'],
    queryFn: loadStaticData,
  })
}
