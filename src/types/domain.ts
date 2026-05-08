export type Plant = {
  id: string
  common_name: string
  scientific_name: string
  family: string
  guild: string
  usda_zones: number[]
  eu_hardiness: string
  days_to_harvest: number
  water_mm_per_week: number
  sun_hours_min: number
  sun_hours_max: number
  rotation_group: string
  soil_ph_min: number
  soil_ph_max: number
  planting_months: string[]
  harvest_months: string[]
  disease_risks: string[]
  companion_boost_ids: string[]
}

export type CompanionEdge = {
  source_id: string
  target_id: string
  kind: 'beneficial' | 'avoid' | 'caution'
  reason: string
  weight: number
}

export type FrostStatistic = {
  zone_id: string
  label: string
  latitude: number
  longitude: number
  last_spring_frost: string
  first_autumn_frost: string
  growing_days: number
  confidence: number
}

export type SoilCell = {
  id: string
  label: string
  latitude: number
  longitude: number
  texture: string
  organic_matter_pc: number
  ph: number
  drainage: string
  water_holding_mm: number
  source: string
}

export type WeatherNormal = {
  zone_id: string
  label: string
  monthly_rain_mm: number[]
  monthly_et0_mm: number[]
  monthly_temp_c: number[]
  cache_policy: string
  source_summary: string
}

export type DiseaseSignature = {
  id: string
  label: string
  affected_plants: string[]
  visual_cues: string[]
  severity_default: 'low' | 'medium' | 'high'
  organic_actions: string[]
}

export type YieldModel = {
  schema_version: string
  model_kind: string
  features: string[]
  coefficients: Record<string, number>
  intercept: number
  mae_percent: number
  training_rows: number
  notes: string
}

export type ArtifactMeta = {
  generated_at: string
  source_commit: string
  schema_version: string
  record_count: number
  input_checksums: Record<string, string>
}

export type StaticData = {
  plants: Plant[]
  companions: CompanionEdge[]
  frost: FrostStatistic[]
  soilCells: SoilCell[]
  weatherNormals: WeatherNormal[]
  diseases: DiseaseSignature[]
  yieldModel: YieldModel
  meta: Record<string, ArtifactMeta>
}

export type GardenPlan = {
  name: string
  selectedCropIds: string[]
  frostZoneId: string
  soilCellId: string
  latitude: number
  longitude: number
  bedAreaSqm: number
  shadePercent: number
  diseasePressure: number
  plantingDateISO: string
}
