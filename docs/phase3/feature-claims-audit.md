# Phase 3 Feature Claims Audit

| Claim source | Claim                                                                              | Before  | Evidence                                                                                    | Phase 3 decision                              | After |
| ------------ | ---------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------- | --------------------------------------------- | ----- |
| README       | Snap or upload a garden photo                                                      | partial | Upload works; direct camera capture is not hinted.                                          | Finish with mobile capture input.             | green |
| README       | Client-side plant and disease candidates                                           | shipped | Photo/text engine returns candidates with confidence.                                       | Keep and test.                                | green |
| README       | Pick crops, frost zone, soil cell, planting date, bed area, shade                  | shipped | Controls exist and autosave.                                                                | Keep; validate persisted state.               | green |
| README       | Generate sun map, watering schedule, rotation, companion hints, harvest projection | shipped | UI renders all derived sections.                                                            | Keep; export summary/CSV.                     | green |
| README       | Fetch versioned static artifacts from `docs/data/v1`                               | shipped | Static data loader fetches all artifacts and meta.                                          | Keep.                                         | green |
| README       | See published version and latest GitHub commit                                     | partial | Footer shows deterministic build commit, not API latest.                                    | Reword to published commit and test it.       | green |
| In-app       | PlantNet-style photo flow                                                          | partial | ONNX runtime loads but no bundled PlantNet model; heuristic classifier is honest in status. | Keep label but clarify limitations in README. | green |
| ADRs         | IndexedDB client-side storage                                                      | shipped | Active plan persists in browser.                                                            | Add migration and export/import.              | green |
| Phase 2 docs | Debug overlay with inference provenance                                            | partial | `?debug=1` shows provenance only.                                                           | Add copy analysis JSON.                       | green |
| Data docs    | Static data contract with metadata                                                 | shipped | `*.meta.json` exists for each artifact.                                                     | Keep.                                         | green |

## Highest-priority mismatches

The meaningful documentation drift was around "snap" and "latest commit." The README now says published commit, describes the offline heuristic/ONNX-ready limitation, and lists export/share behavior.
