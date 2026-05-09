# 0067 State Management Convention

## Status

Accepted.

## Context

The planner has local app state, persisted state, query state, and photo-analysis reducer state.

## Decision

- `GardenPlan` remains the core durable state.
- Derived data is recomputed from `GardenPlan` and static data.
- Photo analysis keeps reducer state because cancellation and request IDs matter.
- Export/import/share only serialize durable state, not transient loading flags.

## Consequences

Reloading or importing a plan is predictable. Transient analysis results can be copied but are not required to recreate the garden plan.

## Alternatives Considered

- Persist every UI panel state: rejected because it makes migrations harder with little user value.
