# Phase 3 Output Pathway Audit

Status key: green = works end-to-end, yellow = partial, red = expected but missing, gray = intentionally not built.

| Exit path             | Before | Evidence                                                              | Required Phase 3 action                                                    | After |
| --------------------- | ------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----- |
| Garden plan autosave  | yellow | IndexedDB save works, but no user-visible export/import or migration. | Add versioned state envelope and tests.                                    | green |
| JSON state export     | red    | No download captures the full plan.                                   | Add downloadable state file, schema version, app version, source metadata. | green |
| JSON state import     | red    | No import path.                                                       | Add import control with validation and migration.                          | green |
| CSV harvest export    | red    | Harvest projection is visible but not exportable.                     | Add deterministic CSV download.                                            | green |
| Copy planner summary  | red    | No copy action.                                                       | Add clipboard summary with fallback status.                                | green |
| Shareable URL         | red    | No hash/link state.                                                   | Add encoded hash for plan state and document limits.                       | green |
| Print/PDF             | red    | Browser print includes all chrome.                                    | Add print action and print CSS that keeps the planning result readable.    | green |
| Copy raw inference    | yellow | Debug mode exposes provenance but no copy.                            | Add copy result JSON for latest analysis.                                  | green |
| API/curl-ready output | gray   | Mode B has no runtime API and no automation endpoint.                 | Keep out of scope; JSON/CSV are the automation formats.                    | gray  |
| Embed code            | gray   | The product is an app, not a widget.                                  | Keep out of scope in ADR 0062.                                             | gray  |

## Real-user impact

Before Phase 3 the planner helped only while the tab was open. Phase 3 made the main outputs durable: state JSON round-trips, harvest CSV opens in spreadsheets, summaries copy out, and hash links carry small plans.
