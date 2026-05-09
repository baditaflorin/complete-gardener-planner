# 0068 Persistence Schema And Migration Policy

## Status

Accepted.

## Context

Phase 2 stored a raw `GardenPlan` in IndexedDB. Future versions need to survive shape changes and support import/export.

## Decision

Persist a versioned state envelope:

- `schemaVersion`: `garden-state.v1`
- `appVersion`
- `exportedAt`
- `plan`

Loading accepts old raw plans and migrates them into the envelope. Invalid imports fail with an actionable message and keep current work intact.

## Consequences

State can round-trip across browsers and versions. Migration tests become mandatory for storage changes.

## Alternatives Considered

- Store only raw plan forever: rejected because it cannot carry provenance or migration metadata.
