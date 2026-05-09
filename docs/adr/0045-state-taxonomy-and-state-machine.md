# 0045 - State Taxonomy and State Machine

## Status

Accepted

## Context

Photo analysis needs explicit loading, cancellation, stale request, ready, and recoverable error states.

## Decision

Use an explicit photo analysis state union and request IDs. New uploads cancel old work; stale completions are ignored. Every error state preserves the previous planner state.

## Consequences

- Double-clicks and rapid uploads become deterministic.
- The UI always has an exit path.

## Alternatives Considered

- Multiple booleans for busy/error/result. Rejected because they create accidental half-states.
