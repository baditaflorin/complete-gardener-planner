# 0013 - Testing Strategy

## Status

Accepted

## Context

The project needs fast local checks because there are no GitHub Actions. Hooks should catch broken builds before push.

## Decision

Use Vitest for frontend logic, Go `testing` for generator logic, and Playwright for smoke tests against the built `docs/` site. `make test` runs unit tests. `make smoke` builds, serves Pages output locally, and runs the happy-path browser smoke test.

## Consequences

- Checks stay fast enough for pre-push.
- The smoke test validates the exact Pages artifact directory.

## Alternatives Considered

- Full e2e suite for every workflow. Deferred until the app stabilizes.
