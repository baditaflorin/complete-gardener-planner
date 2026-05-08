# 0004 - Static Data Contract

## Status

Accepted

## Context

Mode B requires pre-built data artifacts with stable schemas and freshness metadata. The first v1 dataset should be small enough to commit and serve from GitHub Pages.

## Decision

Use versioned JSON artifacts under `docs/data/v1/`:

- `plants.json` plus `plants.meta.json`
- `companions.json` plus `companions.meta.json`
- `frost.json` plus `frost.meta.json`
- `soil-cells.json` plus `soil-cells.meta.json`
- `yield-model.json` plus `yield-model.meta.json`
- `disease-signatures.json` plus `disease-signatures.meta.json`

Each metadata file includes `generated_at`, `source_commit`, `schema_version`, `record_count`, and `input_checksums`.

## Consequences

- The frontend can fetch small JSON without a database server.
- Future larger artifacts can move to GitHub Releases while keeping schema paths versioned.
- Breaking schema changes require a new path such as `/data/v2/`.

## Alternatives Considered

- DuckDB/SQLite-only artifacts. Deferred because JSON keeps the first artifact transparent and small.
- Runtime API contract. Rejected by ADR 0001.
