# 0070 Documentation Reality Alignment Process

## Status

Accepted.

## Context

Phase 3 treats documentation drift as a product bug.

## Decision

README claims must map to either:

- A unit/e2e/smoke test.
- A documented limitation.
- A deliberate out-of-scope ADR.

Claims about "latest commit" will be changed to "published commit" because the footer intentionally uses deterministic build metadata.

## Consequences

The README becomes less flashy and more trustworthy.

## Alternatives Considered

- Keep aspirational claims and rely on postmortem caveats: rejected.
