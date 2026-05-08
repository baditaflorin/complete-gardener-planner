# 0017 - Dependency Policy

## Status

Accepted

## Context

The product touches domains where custom implementations can easily become wrong: sun calculations, local storage, static data validation, inference, and testing.

## Decision

Use production-ready libraries where available: SunCalc, TanStack Query, Zod, idb, Lucide React, DuckDB-WASM, ONNX Runtime Web, Vite, Vitest, Playwright, Go stdlib JSON/testing, Polars, and scikit-learn.

## Consequences

- Domain-specific logic remains smaller and more auditable.
- Dependencies are pinned through lockfiles and reviewed with `npm audit`, `govulncheck`, and local hooks.

## Alternatives Considered

- Hand-rolled replacements. Rejected unless a dependency would exceed the asset budget or require server-only runtime support.
