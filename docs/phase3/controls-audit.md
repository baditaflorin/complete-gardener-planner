# Phase 3 Controls Audit

| Control            | Before | Handler status                                        | Required Phase 3 action                          | After   |
| ------------------ | ------ | ----------------------------------------------------- | ------------------------------------------------ | ------- |
| Star on GitHub     | green  | Opens repository.                                     | Keep.                                            | pending |
| Support            | green  | Opens PayPal.                                         | Keep.                                            | pending |
| Garden name        | green  | Updates plan and autosaves.                           | Keep; include in export/share.                   | pending |
| Frost zone         | green  | Updates zone, lat/lon, nearest soil.                  | Keep.                                            | pending |
| Soil cell          | green  | Updates soil.                                         | Keep.                                            | pending |
| Planting date      | green  | Updates sun/yield timeline.                           | Validate in state schema.                        | pending |
| Bed area           | yellow | Uses `Number()` directly; empty input can become `0`. | Clamp and parse explicitly.                      | pending |
| Shade percent      | green  | Slider updates sun map.                               | Keep.                                            | pending |
| Crop checkboxes    | green  | Toggle crop selection.                                | Keep.                                            | pending |
| Photo file picker  | yellow | Single file only.                                     | Support multiple files and mobile capture.       | pending |
| Cancel analysis    | green  | Aborts current request.                               | Keep and regression test.                        | pending |
| Apply crop guesses | green  | Adds inferred crops.                                  | Keep; status feedback.                           | pending |
| Static data retry  | green  | Refetches artifacts.                                  | Keep.                                            | pending |
| Refresh data       | green  | Refetches artifacts.                                  | Rename if needed after export buttons are added. | pending |
| Details accordions | green  | Browser-native reveal of reasons.                     | Keep.                                            | pending |
| Debug panel        | yellow | Visible only with `?debug=1`; no copy/export.         | Add copy latest analysis JSON.                   | pending |

## Control gaps

There are no obvious dead buttons, but several controls only work for the curated path. The most important control-level fix is to make every visible action either produce a durable artifact or clearly mutate durable state.
