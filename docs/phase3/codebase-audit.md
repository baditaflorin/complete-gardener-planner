# Phase 3 Codebase Health Audit

## DRY Findings

| Finding                                                                             | Files                                                   | Before                                                                                | Phase 3 action                                                                  | After   |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------- |
| Garden plan mutation and derived calculations live in one component                 | `src/features/planner/PlannerApp.tsx`                   | 423-line component owns controls, calculations, export targets, and view composition. | Extract plan model helpers, derived planner hook/module, and action components. | pending |
| Static-data fetch repeats fetch/parse/meta shape manually                           | `src/lib/staticData.ts`                                 | Seven artifact fetches and seven meta fetches are listed by hand.                     | Consolidate artifact specs where it does not obscure types.                     | pending |
| Label lookup repeated                                                               | `PlannerApp.tsx`, `PhotoAnalyzer.tsx`                   | Local `labelFor` and `labelsFor` variants.                                            | Add small domain label helper.                                                  | pending |
| Stable JSON exists in inference but state export needs another canonical serializer | `src/lib/inference/normalize.ts`, future state exporter | Risk of duplicate deterministic stringify.                                            | Reuse stable serializer for exported state.                                     | pending |

## SOLID Findings

| Finding                                                     | Evidence                                                                | Phase 3 action                                                                     | After   |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------- |
| `PlannerApp` has too many reasons to change                 | Data loading, persistence, controls, dashboards, exports, links.        | Split controls/actions from derived calculations.                                  | pending |
| `PhotoAnalyzer` mixes input collection and result rendering | File picker, future paste/drop/batch, and results all in one component. | Keep component but extract input adapter functions in lib to avoid engine changes. | pending |
| Persistence has no version boundary                         | `loadGardenPlan()` trusts IndexedDB payload shape.                      | Add zod schema, state envelope, migration path.                                    | pending |

## Dead Code

| Item                           | Before                                                | Phase 3 action                                                                                  | After   |
| ------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| Starter Vite assets            | `src/assets/react.svg`, `src/assets/vite.svg` unused. | Delete.                                                                                         | pending |
| Hero image                     | `src/assets/hero.png` appears unused.                 | Delete if unreferenced.                                                                         | pending |
| `test-integration` placeholder | Make target says placeholder.                         | Replace with deterministic integration test target or honest no-op wording without placeholder. | pending |

## TODO / FIXME / XXX / HACK

No TODO/FIXME/XXX/HACK markers were found in source docs outside generated bundles. The word `placeholder` appears in the `Makefile` integration target and must be removed or turned into a real target.

## Type Safety Holes

| Finding                            | Evidence                                                                    | Phase 3 action                                                                   | After   |
| ---------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| Go `any` used in artifact boundary | `cmd/build-data/types.go`, `writer.go`                                      | Acceptable only as explicit boundary type; rename to `interface{}` and document. | pending |
| Test casts                         | `src/lib/inference/fixtures.test.ts` uses `as T` and `as GardenInputError`. | Acceptable in tests if narrowed first or isolated in helper.                     | pending |
| Numeric coercion                   | Bed area uses `Number(event.target.value)`.                                 | Parse/clamp through helper.                                                      | pending |

## Inconsistent Patterns

Errors are mostly actionable in inference but generic in static-data fetch. Persistence silently falls back/defaults. Phase 3 should use one convention: boundary functions validate and return domain-specific, user-readable messages at the UI edge.

## Test Coverage Holes

- No tests for export/import round-trip.
- No tests for persisted state migration.
- E2E only checks a crop checkbox, not user-owned input/output.
- No clipboard/share/print affordance checks.
