# Static Data Contract

The v1 app fetches static JSON from:

https://baditaflorin.github.io/complete-gardener-planner/data/v1/

## Artifacts

- `plants.json`
- `companions.json`
- `frost.json`
- `soil-cells.json`
- `weather-normals.json`
- `disease-signatures.json`
- `yield-model.json`

Every artifact has a sibling `*.meta.json` file with:

- `generated_at`
- `source_commit`
- `schema_version`
- `record_count`
- `input_checksums`

## Regeneration

```bash
make data
make build
```

The generator is deterministic except for `generated_at` and source commit metadata. Future breaking changes must use a new path such as `/data/v2/`.

## Freshness

V1 demo data is committed to the repository and refreshed manually. Production-scale weather, USDA/EU plant, soil raster, and model artifacts can be generated offline and published by semver release.
