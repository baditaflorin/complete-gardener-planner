# Phase 3 Controls Audit

| Control            | Before | Handler status                                        | Required Phase 3 action                          | After |
| ------------------ | ------ | ----------------------------------------------------- | ------------------------------------------------ | ----- |
| Star on GitHub     | green  | Opens repository.                                     | Keep.                                            | green |
| Support            | green  | Opens PayPal.                                         | Keep.                                            | green |
| Garden name        | green  | Updates plan and autosaves.                           | Keep; include in export/share.                   | green |
| Frost zone         | green  | Updates zone, lat/lon, nearest soil.                  | Keep.                                            | green |
| Soil cell          | green  | Updates soil.                                         | Keep.                                            | green |
| Planting date      | green  | Updates sun/yield timeline.                           | Validate in state schema.                        | green |
| Bed area           | yellow | Uses `Number()` directly; empty input can become `0`. | Clamp and parse explicitly.                      | green |
| Shade percent      | green  | Slider updates sun map.                               | Keep.                                            | green |
| Crop checkboxes    | green  | Toggle crop selection.                                | Keep.                                            | green |
| Photo file picker  | yellow | Single file only.                                     | Support multiple files and mobile capture.       | green |
| Cancel analysis    | green  | Aborts current request.                               | Keep and regression test.                        | green |
| Apply crop guesses | green  | Adds inferred crops.                                  | Keep; status feedback.                           | green |
| Static data retry  | green  | Refetches artifacts.                                  | Keep.                                            | green |
| Refresh data       | green  | Refetches artifacts.                                  | Rename if needed after export buttons are added. | green |
| Details accordions | green  | Browser-native reveal of reasons.                     | Keep.                                            | green |
| Debug panel        | yellow | Visible only with `?debug=1`; no copy/export.         | Add copy latest analysis JSON.                   | green |

## Control gaps

There were no obvious dead buttons, but several controls only worked for the curated path. Phase 3 added durable import, export, share, and print controls and kept every visible action wired to a real handler.
