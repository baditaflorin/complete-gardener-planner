# Phase 3 Findings Synthesis

## Top 5 Usability Gaps

1. Users can analyze only a single uploaded image, even though real gardeners bring pasted notes, soil reports, weather CSV snippets, and phone-camera captures.
2. The planner has no durable export/import path, so work cannot move between browsers or collaborators.
3. Harvest projections and planner summaries are visible but trapped in the UI.
4. Drag/drop and paste are implied by modern upload UI expectations but not wired.
5. Persistence silently trusts old IndexedDB shapes and offers no reset/recover path.

## Top 5 Half-Baked Features

| Feature                 | Decision        | Rationale                                                                            |
| ----------------------- | --------------- | ------------------------------------------------------------------------------------ |
| Snap garden photo       | finish          | Add mobile camera capture hint and keep file upload path.                            |
| PlantNet-style flow     | finish honestly | Keep ONNX-ready local path, expose heuristic status, document real model limitation. |
| Debug overlay           | finish          | Add copy latest analysis JSON.                                                       |
| Integration test target | finish          | Replace placeholder with a real lightweight integration target.                      |
| Starter assets          | delete          | They are not product features and create noise.                                      |

## Top 5 Codebase Pain Points

1. `PlannerApp.tsx` is a god component.
2. Persistence lacks schemas, migrations, and an export envelope.
3. Input handling is coupled directly to `PhotoAnalyzer`.
4. There is no canonical export/summary builder.
5. Static data boundary errors are generic.

## Top 5 Documentation / Reality Mismatches

1. README says "snap" but the UI only hints upload.
2. README says "latest GitHub commit"; deterministic published commit is more accurate.
3. README does not mention export/import/share limitations.
4. PlantNet-style wording needs limitation context.
5. Quickstart does not mention `make smoke` as the confidence check.

## Fully Usable Means

- A gardener can start from a phone photo, pasted garden note, or sample without guessing which path is supported.
- A gardener can save, export, import, share, and reset a plan without losing work.
- A gardener can copy or download the main outputs for spreadsheet/email use.
- Every visible button either changes durable state, produces a durable artifact, or has a clear reason it cannot.
- The README describes only behavior that is shipped and smoke-tested.

## Phase 3 Success Metrics

- Input pathways: at least 9 of 12 audit rows green; gray rows have ADR rationale.
- Output pathways: at least 7 of 10 audit rows green; gray rows have ADR rationale.
- Controls: 100% of visible controls have end-to-end handlers tested by unit or e2e coverage.
- Codebase: zero untracked TODO/FIXME/XXX/HACK; no source file over 350 lines except generated/static assets.
- Persistence: export/import round-trip restores the same `GardenPlan`; old unversioned plan migrates.
- Stranger test: top 3 observed issues are fixed before release.

## Out Of Scope

- Runtime backend or auth.
- A real remote PlantNet model service.
- Cross-device sync beyond export/import/share URL.
- New crop intelligence beyond the Phase 2 engine.
- Visual polish, dark mode, command palette, animations, or marketing pages.
