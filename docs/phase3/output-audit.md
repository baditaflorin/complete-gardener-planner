# Phase 3 Output Pathway Audit

Status key: green = works end-to-end, yellow = partial, red = expected but missing, gray = intentionally not built.

| Exit path             | Before | Evidence                                                              | Required Phase 3 action                                                    | After   |
| --------------------- | ------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------- |
| Garden plan autosave  | yellow | IndexedDB save works, but no user-visible export/import or migration. | Add versioned state envelope and tests.                                    | pending |
| JSON state export     | red    | No download captures the full plan.                                   | Add downloadable state file, schema version, app version, source metadata. | pending |
| JSON state import     | red    | No import path.                                                       | Add import control with validation and migration.                          | pending |
| CSV harvest export    | red    | Harvest projection is visible but not exportable.                     | Add deterministic CSV download.                                            | pending |
| Copy planner summary  | red    | No copy action.                                                       | Add clipboard summary with fallback status.                                | pending |
| Shareable URL         | red    | No hash/link state.                                                   | Add encoded hash for plan state and document limits.                       | pending |
| Print/PDF             | red    | Browser print includes all chrome.                                    | Add print action and print CSS that keeps the planning result readable.    | pending |
| Copy raw inference    | yellow | Debug mode exposes provenance but no copy.                            | Add copy result JSON for latest analysis.                                  | pending |
| API/curl-ready output | gray   | Mode B has no runtime API and no automation endpoint.                 | Keep out of scope; JSON/CSV are the automation formats.                    | pending |
| Embed code            | gray   | The product is an app, not a widget.                                  | Keep out of scope in ADR 0062.                                             | pending |

## Real-user impact

The planner currently helps only while the tab is open. A user cannot take work to a spreadsheet, send a plan to a collaborator, save a snapshot before experimenting, or reload the same state on another browser. Phase 3 must make outputs durable and round-trippable.
