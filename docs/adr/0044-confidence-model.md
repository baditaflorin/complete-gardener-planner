# 0044 - Confidence Model

## Status

Accepted

## Context

No silent wrongness is a non-negotiable Phase 2 bar.

## Decision

Represent confidence as numeric score plus `low`, `medium`, or `high` level. Filename-only candidates are capped below high confidence. Conflicts and host incompatibility lower confidence and add warnings.

## Consequences

- The UI can show when users should verify.
- Tests can block wrong-confident fixture failures.

## Alternatives Considered

- Plain percentages. Rejected because users need confidence semantics and reasons.
