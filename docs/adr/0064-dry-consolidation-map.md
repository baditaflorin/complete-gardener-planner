# 0064 DRY Consolidation Map

## Status

Accepted.

## Context

Phase 3 adds import/export/share paths that would duplicate plan serialization, label lookup, and summary generation if implemented inline.

## Decision

Create canonical helpers for:

- `GardenPlan` schema, migration, normalization, and defaulting.
- State envelope import/export.
- Planner summary and harvest CSV export.
- Plant label lookup.
- Derived planner calculations used by UI and export tests.

## Consequences

The UI calls application helpers instead of rebuilding data manually. Duplications that do not yet have a clear abstraction stay documented rather than forced.

## Alternatives Considered

- Move all planner logic into one class: rejected as too heavy for a static React app.
- Leave duplication until later: rejected because output completeness would multiply it.
