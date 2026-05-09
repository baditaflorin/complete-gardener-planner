# 0049 - Inspectability and Debug Surface

## Status

Accepted

## Context

Power users and maintainers need to understand why the app guessed something.

## Decision

Use `?debug=1` to reveal inference provenance, diagnostics, and performance marks. Normal users still see concise reasons and warnings.

## Consequences

- Support can reproduce issues.
- Debug data remains static/client-only.

## Alternatives Considered

- Hidden console logs. Rejected because production logs are intentionally minimal.
