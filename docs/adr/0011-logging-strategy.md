# 0011 - Logging Strategy

## Status

Accepted

## Context

Mode B has no server logs. Production browser logs should be minimal and avoid user data.

## Decision

Use browser console logging only for unrecoverable developer diagnostics in non-production builds. User-facing errors appear in the UI. The Go generator writes concise status messages to stdout and errors to stderr.

## Consequences

- Production Pages sessions do not emit noisy logs.
- Data generation remains script-friendly.

## Alternatives Considered

- Client log collection. Rejected because analytics and telemetry are non-goals for v1.
