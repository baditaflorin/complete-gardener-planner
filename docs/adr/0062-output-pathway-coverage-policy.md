# 0062 Output Pathway Coverage Policy

## Status

Accepted.

## Context

The planner generated useful results but trapped them in the browser view. Real users need to save, share, print, and move data to spreadsheets or collaborators.

## Decision

Phase 3 will add:

- Downloadable JSON state envelope.
- JSON state import with validation and migration.
- CSV harvest export.
- Copyable planner summary.
- Copyable latest analysis JSON.
- Hash-encoded share URL for small plans.
- Browser print action and print styles.

API/curl and embed outputs remain out of scope because Mode B has no runtime API and the app is not a widget.

## Consequences

JSON state becomes the canonical round-trip format. CSV is intentionally narrow and covers harvest projections only.

## Alternatives Considered

- SQLite/Parquet export in-browser: deferred because it would increase payload and complexity for a small planner state.
- Server-backed short links: rejected by Mode B.
