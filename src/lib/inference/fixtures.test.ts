import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import type { DiseaseSignature, Plant } from '../../types/domain'
import { GardenInputError } from './errors'
import { analyzeGardenEvidence } from './engine'
import { stableStringify } from './normalize'
import type { GardenEvidence, GardenInference } from './types'

type Fixture = {
  id: string
  source_url: string
  evidence: GardenEvidence
}

type Expected = {
  useful: boolean
  expectedPlantIds?: string[]
  expectedDiseaseIds?: string[]
  expectedSuggestedCropIds?: string[]
  minimumSuggestedCropCount?: number
  minimumTopPlantConfidence?: number
  minimumTopDiseaseConfidence?: number
  forbiddenHighConfidencePlantIds?: string[]
  expectedDiagnostics?: string[]
  expectedErrorKind?: string
  expectedNowWhatIncludes?: string
  expectedSoilPH?: number
  expectedOrganicMatter?: number
  expectedWeatherFields?: string[]
}

const root = process.cwd()
const fixtureDir = path.join(root, 'test/fixtures/realdata')
const plants = readJSON<Plant[]>(path.join(root, 'docs/data/v1/plants.json'))
const diseases = readJSON<DiseaseSignature[]>(path.join(root, 'docs/data/v1/disease-signatures.json'))

const fixtures = readdirSync(fixtureDir)
  .filter((file) => file.endsWith('.json') && !file.endsWith('.expected.json'))
  .sort()
  .map((file) => {
    const fixture = readJSON<Fixture>(path.join(fixtureDir, file))
    const expected = readJSON<Expected>(path.join(fixtureDir, file.replace('.json', '.expected.json')))
    return { fixture, expected }
  })

describe('real-data inference fixtures', () => {
  it('keeps all fixture outputs deterministic', () => {
    for (const { fixture, expected } of fixtures) {
      if (expected.expectedErrorKind) continue
      const first = runFixture(fixture)
      const second = runFixture(fixture)
      expect(stableStringify(first), fixture.id).toBe(stableStringify(second))
    }
  })

  it('passes the Phase 2 real-data rubric', () => {
    let usefulCount = 0
    const started = performance.now()

    for (const { fixture, expected } of fixtures) {
      if (expected.expectedErrorKind) {
        expectFailure(fixture, expected)
        continue
      }

      const result = runFixture(fixture)
      if (expected.useful) usefulCount += 1
      expectMatches(result, expected, fixture.id)
    }

    const elapsed = performance.now() - started
    expect(usefulCount).toBeGreaterThanOrEqual(7)
    expect(elapsed / fixtures.length).toBeLessThan(20)
  })
})

function expectFailure(fixture: Fixture, expected: Expected) {
  try {
    runFixture(fixture)
    throw new Error(`Expected ${fixture.id} to fail`)
  } catch (caught) {
    expect(caught, fixture.id).toBeInstanceOf(GardenInputError)
    const details = (caught as GardenInputError).details
    expect(details.kind).toBe(expected.expectedErrorKind)
    expect(details.nowWhat.toLowerCase()).toContain(expected.expectedNowWhatIncludes?.toLowerCase() ?? '')
  }
}

function expectMatches(result: GardenInference, expected: Expected, id: string) {
  for (const plantID of expected.expectedPlantIds ?? []) {
    expect(
      result.plantCandidates.some((candidate) => candidate.id === plantID && candidate.confidence >= 0.5),
      id,
    ).toBe(true)
  }
  for (const diseaseID of expected.expectedDiseaseIds ?? []) {
    expect(
      result.diseaseCandidates.some((candidate) => candidate.id === diseaseID && candidate.confidence >= 0.5),
      id,
    ).toBe(true)
  }
  for (const cropID of expected.expectedSuggestedCropIds ?? []) {
    expect(result.suggestedCropIds, id).toContain(cropID)
  }
  if (expected.minimumSuggestedCropCount) {
    expect(result.suggestedCropIds.length, id).toBeGreaterThanOrEqual(expected.minimumSuggestedCropCount)
  }
  if (expected.minimumTopPlantConfidence) {
    expect(result.plantCandidates[0]?.confidence, id).toBeGreaterThanOrEqual(
      expected.minimumTopPlantConfidence,
    )
  }
  if (expected.minimumTopDiseaseConfidence) {
    expect(result.diseaseCandidates[0]?.confidence, id).toBeGreaterThanOrEqual(
      expected.minimumTopDiseaseConfidence,
    )
  }
  for (const plantID of expected.forbiddenHighConfidencePlantIds ?? []) {
    const candidate = result.plantCandidates.find((item) => item.id === plantID)
    expect(candidate?.confidence ?? 0, id).toBeLessThan(0.78)
  }
  for (const diagnostic of expected.expectedDiagnostics ?? []) {
    expect(result.diagnostics, id).toContain(diagnostic)
  }
  if (expected.expectedSoilPH) {
    expect(result.extracted.soil?.ph, id).toBe(expected.expectedSoilPH)
  }
  if (expected.expectedOrganicMatter) {
    expect(result.extracted.soil?.organicMatterPercent, id).toBe(expected.expectedOrganicMatter)
  }
  for (const field of expected.expectedWeatherFields ?? []) {
    expect(result.extracted.weatherFields, id).toContain(field)
  }
}

function runFixture(fixture: Fixture) {
  return analyzeGardenEvidence(
    {
      ...fixture.evidence,
      sourceUrl: fixture.source_url,
    },
    { plants, diseases },
  )
}

function readJSON<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T
}
