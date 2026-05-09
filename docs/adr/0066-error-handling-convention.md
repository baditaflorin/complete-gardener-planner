# 0066 Error Handling Convention

## Status

Accepted.

## Context

Inference errors are actionable, while storage/static-data errors are more generic. Phase 3 needs consistent user-facing recovery.

## Decision

Boundary functions validate and throw typed or descriptive errors. UI surfaces them as:

- What failed.
- Why it likely happened.
- What the user can do next.

Static Mode B errors never expose stack traces in production UI.

## Consequences

Import, URL fetch, clipboard, and static-data failures will be domain messages rather than raw exceptions.

## Alternatives Considered

- Central toast system: deferred as polish; inline status is enough.
