# 0002 - Architecture Overview and Module Boundaries

## Status

Accepted

## Context

The app combines geospatial-ish garden planning, static agronomic data, browser photo analysis, and local user plans. The code needs clear boundaries so optional heavy modules do not inflate first load.

## Decision

Use these boundaries:

- `cmd/build-data/`: deterministic Mode B data generator.
- `internal/`: generator support packages and shared error utility.
- `docs/data/v1/`: generated public artifacts and sibling metadata.
- `src/features/*`: frontend feature slices for planner, photo analysis, static data, and projections.
- `src/lib/*`: reusable browser services for storage, sun, watering, rotation, model adapters, and data loading.
- `src/types/*`: shared TypeScript domain contracts.
- `ml/`: optional Polars/scikit-learn yield-model training workflow.

## Consequences

- The runtime app remains static and browser-only.
- Feature code can be tested without rendering the whole application.
- Heavy inference/data libraries are kept behind explicit adapters.

## Alternatives Considered

- Single flat frontend module. Rejected because feature coupling would make later datasets and model adapters hard to evolve.
- Runtime API boundary. Rejected by ADR 0001.
