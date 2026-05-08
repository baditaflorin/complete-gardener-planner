# 0005 - Client-Side Storage Strategy

## Status

Accepted

## Context

Garden beds, crop plans, photo analysis history, and offline data freshness should persist without accounts or a backend.

## Decision

Use IndexedDB through `idb` for structured garden plans and analysis records. Use localStorage only for tiny UI preferences such as selected tab. Do not store uploaded photo bytes by default; store derived analysis summaries instead.

## Consequences

- User data remains local and private.
- The app works offline after first load.
- Cross-device sync is out of scope for v1.

## Alternatives Considered

- OPFS for all data. Deferred until the app stores large raster/model files.
- Server persistence. Rejected because auth/sync is a non-goal.
