# Phase 3 Feature Claims Audit

| Claim source | Claim                                                                              | Before  | Evidence                                                                                    | Phase 3 decision                              | After   |
| ------------ | ---------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------- | --------------------------------------------- | ------- |
| README       | Snap or upload a garden photo                                                      | partial | Upload works; direct camera capture is not hinted.                                          | Finish with mobile capture input.             | pending |
| README       | Client-side plant and disease candidates                                           | shipped | Photo/text engine returns candidates with confidence.                                       | Keep and test.                                | pending |
| README       | Pick crops, frost zone, soil cell, planting date, bed area, shade                  | shipped | Controls exist and autosave.                                                                | Keep; validate persisted state.               | pending |
| README       | Generate sun map, watering schedule, rotation, companion hints, harvest projection | shipped | UI renders all derived sections.                                                            | Keep; export summary/CSV.                     | pending |
| README       | Fetch versioned static artifacts from `docs/data/v1`                               | shipped | Static data loader fetches all artifacts and meta.                                          | Keep.                                         | pending |
| README       | See published version and latest GitHub commit                                     | partial | Footer shows deterministic build commit, not API latest.                                    | Reword to published commit and test it.       | pending |
| In-app       | PlantNet-style photo flow                                                          | partial | ONNX runtime loads but no bundled PlantNet model; heuristic classifier is honest in status. | Keep label but clarify limitations in README. | pending |
| ADRs         | IndexedDB client-side storage                                                      | shipped | Active plan persists in browser.                                                            | Add migration and export/import.              | pending |
| Phase 2 docs | Debug overlay with inference provenance                                            | partial | `?debug=1` shows provenance only.                                                           | Add copy analysis JSON.                       | pending |
| Data docs    | Static data contract with metadata                                                 | shipped | `*.meta.json` exists for each artifact.                                                     | Keep.                                         | pending |

## Highest-priority mismatches

The only meaningful documentation drift is around "snap" and "latest commit." Both are fixable without changing architecture. The PlantNet-style wording is acceptable only if the limitations section says the bundled model is currently a heuristic/ONNX-ready local flow rather than a real PlantNet model artifact.
