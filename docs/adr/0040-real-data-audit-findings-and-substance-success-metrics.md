# 0040 - Real-Data Audit Findings and Substance Success Metrics

## Status

Accepted

## Context

V1 demos well but fails when users bring real photos, unsupported phone formats, mixed beds, misleading filenames, and region assumptions.

## Decision

Use the 10 fixtures in `test/fixtures/realdata/` as the Phase 2 grading rubric. Substance succeeds when at least 7 fixtures produce useful first guesses, all outputs are deterministic, and every recoverable failure uses domain terms.

## Consequences

- Fixture regressions block release.
- The postmortem reports pass rate before/after.
- UI polish is deferred until the engine passes the rubric.

## Alternatives Considered

- Continue with curated demo data. Rejected because it preserves toy behavior.
