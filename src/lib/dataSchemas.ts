import { z } from 'zod'

export const plantSchema = z.object({
  id: z.string(),
  common_name: z.string(),
  scientific_name: z.string(),
  family: z.string(),
  guild: z.string(),
  usda_zones: z.array(z.number()),
  eu_hardiness: z.string(),
  days_to_harvest: z.number(),
  water_mm_per_week: z.number(),
  sun_hours_min: z.number(),
  sun_hours_max: z.number(),
  rotation_group: z.string(),
  soil_ph_min: z.number(),
  soil_ph_max: z.number(),
  planting_months: z.array(z.string()),
  harvest_months: z.array(z.string()),
  disease_risks: z.array(z.string()),
  companion_boost_ids: z.array(z.string()),
})

export const companionSchema = z.object({
  source_id: z.string(),
  target_id: z.string(),
  kind: z.enum(['beneficial', 'avoid', 'caution']),
  reason: z.string(),
  weight: z.number(),
})

export const frostSchema = z.object({
  zone_id: z.string(),
  label: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  last_spring_frost: z.string(),
  first_autumn_frost: z.string(),
  growing_days: z.number(),
  confidence: z.number(),
})

export const soilCellSchema = z.object({
  id: z.string(),
  label: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  texture: z.string(),
  organic_matter_pc: z.number(),
  ph: z.number(),
  drainage: z.string(),
  water_holding_mm: z.number(),
  source: z.string(),
})

export const weatherNormalSchema = z.object({
  zone_id: z.string(),
  label: z.string(),
  monthly_rain_mm: z.array(z.number()).length(12),
  monthly_et0_mm: z.array(z.number()).length(12),
  monthly_temp_c: z.array(z.number()).length(12),
  cache_policy: z.string(),
  source_summary: z.string(),
})

export const diseaseSchema = z.object({
  id: z.string(),
  label: z.string(),
  affected_plants: z.array(z.string()),
  visual_cues: z.array(z.string()),
  severity_default: z.enum(['low', 'medium', 'high']),
  organic_actions: z.array(z.string()),
})

export const yieldModelSchema = z.object({
  schema_version: z.string(),
  model_kind: z.string(),
  features: z.array(z.string()),
  coefficients: z.record(z.string(), z.number()),
  intercept: z.number(),
  mae_percent: z.number(),
  training_rows: z.number(),
  notes: z.string(),
})

export const metaSchema = z.object({
  generated_at: z.string(),
  source_commit: z.string(),
  schema_version: z.string(),
  record_count: z.number(),
  input_checksums: z.record(z.string(), z.string()),
})
