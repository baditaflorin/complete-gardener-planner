# 0006 - WASM Modules Used

## Status

Accepted

## Context

The product roadmap includes DuckDB-style local querying and ONNX-style photo inference. WebAssembly can support both while keeping the app static.

## Decision

Ship `@duckdb/duckdb-wasm` and `onnxruntime-web` as lazy-loaded optional adapters. V1 uses deterministic demo adapters when model binaries are unavailable, while the module boundaries and UI are ready for real ONNX/DuckDB artifacts.

## Consequences

- Initial JS remains under the v1 budget because heavy modules are not part of the eager path.
- GitHub Pages header limitations mean we avoid features that require custom COOP/COEP headers in v1.
- Real model artifacts can be attached to releases later without changing the frontend feature contract.

## Alternatives Considered

- Eager WASM imports. Rejected because it hurts first load and offline install size.
- Runtime inference backend. Rejected by ADR 0001.
