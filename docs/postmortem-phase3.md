# Phase 3 Postmortem

## Audit Grids

| Audit           |                Before green |              After green |                     Gray / out of scope |
| --------------- | --------------------------: | -----------------------: | --------------------------------------: |
| Input pathways  |                        1/12 |                    10/12 | 1 folder upload, 1 CORS-limited URL row |
| Output pathways |                        0/10 |                     8/10 |               API/curl and embed output |
| Controls        |                       12/16 |                    16/16 |                                       0 |
| Feature claims  |          5/10 fully shipped | 10/10 true or documented |                                       0 |
| Codebase health | 3 material pain points open |       0 release blockers |    Static-data fetch list left explicit |

## Half-Baked Feature Triage

| Feature             | Outcome           | Rationale                                                                               |
| ------------------- | ----------------- | --------------------------------------------------------------------------------------- |
| Snap garden photo   | Finished          | File input now uses mobile camera capture hint and keeps normal upload.                 |
| PlantNet-style flow | Finished honestly | UI remains ONNX-ready/offline heuristic; README now says no bundled PlantNet model yet. |
| Debug overlay       | Finished          | Latest analysis JSON can be copied.                                                     |
| Integration target  | Finished          | `make test-integration` runs fixture tests and the Pages smoke path.                    |
| Starter assets      | Deleted           | Unused Vite/hero assets were removed.                                                   |

## Codebase Health Metrics

| Metric                      |                         Before |                                                         After |
| --------------------------- | -----------------------------: | ------------------------------------------------------------: |
| Core files over 350 lines   |                              3 |                                                             0 |
| Source TODO/FIXME/XXX/HACK  |                              0 |                                                             0 |
| Source `any` / `@ts-ignore` | 3 Go `any` aliases, 0 TS `any` |                    0 TS `any`; Go boundary uses `interface{}` |
| Dead starter assets         |                              3 |                                                             0 |
| Real-user path tests        |               1 e2e happy path | e2e covers text analysis, state export, CSV export, share URL |
| State round-trip tests      |                              0 |                                                  3 unit tests |

## Stranger Test

The private-window fallback test found three user-facing issues: no obvious output path, too narrow input path, and URL input ambiguity. Phase 3 fixed all three with the action panel, widened evidence input, and CORS-aware copy.

## Documentation / Reality Mismatches Fixed

- README now says published commit instead of latest GitHub commit.
- README documents state JSON, harvest CSV, share links, print, and limitations.
- PlantNet-style limitation is explicit.
- `make test-integration` is real.

## Surprises

- The Phase 2 inference engine already handled text, soil, and weather evidence; the app simply did not expose those paths.
- The biggest usability gain came from outputs, not more analysis logic.
- Keeping Mode B was still correct; hash links and state files cover the needed sharing without a backend.

## Still-Open Completeness Gaps

1. Real PlantNet-style ONNX model artifact and disease classifier weights.
2. Import/export for full analysis history, not just the durable garden plan.
3. Better URL ingestion for sites that block CORS, likely via user-supplied page text unless architecture changes.
4. More static data breadth for USDA/EU crops and soil rasters.
5. Human stranger test with someone outside the project.

## Honest Take

Yes, a stranger can now use the app for a real small garden workflow end-to-end: enter photo/text evidence, adjust the bed, get planning outputs, export/share/print, and reload state later. It is still not complete for professional agronomy or true PlantNet-grade image ID because the model/data breadth is intentionally small and offline-static. It no longer feels like a toy for the audited personal-garden use case; it still feels early for large farms, arbitrary web ingestion, and production-grade ML diagnosis.
