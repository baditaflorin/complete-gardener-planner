# 0069 Type Safety Policy At Boundaries

## Status

Accepted.

## Context

External JSON, IndexedDB payloads, URL hash state, and import files are untrusted. Phase 3 adds more boundaries.

## Decision

- Use zod schemas for browser JSON boundaries.
- Use explicit parsing/clamping for numeric controls.
- Keep unavoidable Go generic data as `interface{}` at artifact boundaries.
- Avoid unsafe casts outside test helpers and schema boundaries.

## Consequences

Bad user files do not corrupt current work. Type assertions become localized and auditable.

## Alternatives Considered

- Trust imported JSON because it is user-generated: rejected; users will edit files by hand.
