# 0047 - Error Taxonomy and Messaging Guidelines

## Status

Accepted

## Context

Phase 2 requires actionable errors.

## Decision

Errors carry `kind`, `what`, `why`, `nowWhat`, and `recoverable`. Kinds include unsupported format, corrupted image, too large, static data, and inference unavailable.

## Consequences

- UI errors become consistent.
- Tests can assert recovery copy.

## Alternatives Considered

- Throw raw exceptions. Rejected because users cannot act on them.
