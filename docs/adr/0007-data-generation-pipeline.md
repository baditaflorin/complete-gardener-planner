# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

Static data needs to be reproducible, deterministic, and safe to commit. The original product vision references plant databases, companion planting graphs, weather cache, frost statistics, soil raster handling, and yield prediction.

## Decision

Use `make data` to run a Go generator at `cmd/build-data/`. The generator writes normalized JSON artifacts into `docs/data/v1/` with stable ordering and sibling metadata. Optional ML training lives in `ml/train_yield_model.py` using Polars and scikit-learn and can regenerate `yield-model.json`.

## Consequences

- The default data pipeline is fast and has no secrets.
- The Python ML path documents the production yield-model approach without making local smoke tests depend on heavy packages.
- Partial writes use a temporary directory and atomic replacement.

## Alternatives Considered

- Scrape live public databases in the frontend. Rejected because it is brittle and can require secrets or CORS workarounds.
- Full GDAL/libosmscout integration in v1. Deferred to keep Pages static and repo setup portable.
