# 0014 - Error Handling Conventions

## Status

Accepted

## Context

Errors should be recoverable, visible, and testable across the data pipeline and frontend.

## Decision

The frontend uses typed `Result`-style helpers where useful, Zod parsing for external data, error boundaries, and visible inline alerts. The Go generator returns wrapped errors and uses `internal/utils.HandleErrorOrLogWithMessages(err, errMsg, successMsg)` at command edges. No panics are used for expected failures.

## Consequences

- Data contract failures fail loudly during development.
- Users see actionable retry/fallback messages instead of blank screens.

## Alternatives Considered

- Silent fallbacks. Rejected because stale or invalid agronomic data can mislead users.
