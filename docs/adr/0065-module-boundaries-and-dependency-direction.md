# 0065 Module Boundaries And Dependency Direction

## Status

Accepted.

## Context

`PlannerApp` currently owns persistence, controls, derived data, and rendering. Phase 3 needs more behavior without making the component harder to reason about.

## Decision

Use a one-way dependency direction:

- UI components import application/domain helpers.
- `src/lib` modules do not import UI components.
- State envelopes and schemas live near storage/export boundaries.
- Inference remains locked from Phase 2 except for input adapters.

## Consequences

Feature work lands in smaller modules and tests can exercise behavior without rendering the whole app.

## Alternatives Considered

- Add a global state library: rejected because React state plus IndexedDB is enough.
- Full feature-folder rewrite: rejected as too disruptive for a completion pass.
