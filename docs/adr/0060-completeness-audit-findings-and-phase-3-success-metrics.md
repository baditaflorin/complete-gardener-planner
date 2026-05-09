# 0060 Completeness Audit Findings And Phase 3 Success Metrics

## Status

Accepted.

## Context

Phase 2 made the inference engine smarter, but Phase 3 asks whether a stranger can use the application on their own data without help. The audit found missing input pathways, missing output pathways, persistence gaps, and a large planner component.

## Decision

Phase 3 success is measured by:

- At least 9 of 12 input rows green, with out-of-scope rows justified.
- At least 7 of 10 output rows green, with out-of-scope rows justified.
- Export/import round-trip restores the same `GardenPlan`.
- All visible controls have real handlers or are removed.
- No source TODO/FIXME/XXX/HACK and no placeholder integration target.
- Live Pages smoke passes after publishing.

## Consequences

The release emphasizes practical completion over visual polish. Some advanced items, such as folder uploads and embed/API output, stay out of scope because Mode B has no server.

## Alternatives Considered

- Add new planner intelligence: rejected because Phase 2 engine work is locked.
- Add a runtime backend for share links: rejected because Mode B remains sufficient.
