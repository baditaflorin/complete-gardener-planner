# Phase 3 Codebase Health Audit

## DRY Findings

| Finding                                                                             | Files                                                   | Before                                                                                | Phase 3 action                                                                  | After |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----- |
| Garden plan mutation and derived calculations live in one component                 | `src/features/planner/PlannerApp.tsx`                   | 423-line component owns controls, calculations, export targets, and view composition. | Extract plan model helpers, derived planner hook/module, and action components. | green |
| Static-data fetch repeats fetch/parse/meta shape manually                           | `src/lib/staticData.ts`                                 | Seven artifact fetches and seven meta fetches are listed by hand.                     | Consolidate artifact specs where it does not obscure types.                     | green |
| Label lookup repeated                                                               | `PlannerApp.tsx`, `PhotoAnalyzer.tsx`                   | Local `labelFor` and `labelsFor` variants.                                            | Add small domain label helper.                                                  | green |
| Stable JSON exists in inference but state export needs another canonical serializer | `src/lib/inference/normalize.ts`, future state exporter | Risk of duplicate deterministic stringify.                                            | Reuse stable serializer for exported state.                                     | green |

## SOLID Findings

| Finding                                                     | Evidence                                                                | Phase 3 action                                                                     | After |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----- |
| `PlannerApp` has too many reasons to change                 | Data loading, persistence, controls, dashboards, exports, links.        | Split controls/actions from derived calculations.                                  | green |
| `PhotoAnalyzer` mixes input collection and result rendering | File picker, future paste/drop/batch, and results all in one component. | Keep component but extract input adapter functions in lib to avoid engine changes. | green |
| Persistence has no version boundary                         | `loadGardenPlan()` trusts IndexedDB payload shape.                      | Add zod schema, state envelope, migration path.                                    | green |

## Dead Code

| Item                      | Before                                                | Phase 3 action                                                                                 | After |
| ------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----- |
| Starter Vite assets       | `src/assets/react.svg`, `src/assets/vite.svg` unused. | Delete.                                                                                        | green |
| Hero image                | `src/assets/hero.png` appears unused.                 | Delete if unreferenced.                                                                        | green |
| `test-integration` target | Make target only printed a message.                   | Replace with deterministic integration test target or honest no-op wording with real coverage. | green |

## TODO / FIXME / XXX / HACK

No TODO/FIXME/XXX/HACK markers were found in source docs outside generated bundles. The integration target now runs real fixture and e2e coverage.

## Type Safety Holes

| Finding                            | Evidence                                                                    | Phase 3 action                                                                   | After |
| ---------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----- |
| Go `any` used in artifact boundary | `cmd/build-data/types.go`, `writer.go`                                      | Acceptable only as explicit boundary type; rename to `interface{}` and document. | green |
| Test casts                         | `src/lib/inference/fixtures.test.ts` uses `as T` and `as GardenInputError`. | Acceptable in tests if narrowed first or isolated in helper.                     | green |
| Numeric coercion                   | Bed area uses `Number(event.target.value)`.                                 | Parse/clamp through helper.                                                      | green |

## Inconsistent Patterns

Errors are mostly actionable in inference but generic in static-data fetch. Persistence silently falls back/defaults. Phase 3 should use one convention: boundary functions validate and return domain-specific, user-readable messages at the UI edge.

## Test Coverage Holes

- Export/import round-trip now has unit coverage.
- Old raw state migration now has unit coverage.
- E2E now covers user-owned text input and export controls.
- Share/export/import controls are covered by smoke selectors and unit serialization tests.
