# Phase 3 Input Pathway Audit

Status key: green = works end-to-end on real user data, yellow = partial, red = claimed or expected but broken, gray = intentionally not built.

| Entry point                 | Before | Evidence                                                                                     | Required Phase 3 action                                                                | After                      |
| --------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------- |
| Single image upload         | green  | File picker accepts `image/*`; JPEG/PNG decode; HEIC/corrupt/oversize errors are actionable. | Keep and test.                                                                         | green                      |
| Mobile camera picker        | yellow | `accept=image/*` opens file sources, but no `capture` hint for direct camera capture.        | Add `capture=environment` and document browser limitations.                            | green                      |
| Drag and drop image         | red    | Drop zone is visually implied but has no drop handlers.                                      | Add drag/drop, route through same analyzer.                                            | green                      |
| Paste image                 | red    | Clipboard paste is not handled.                                                              | Add paste handler and permission-safe fallback copy.                                   | green                      |
| Paste text/HTML garden note | red    | Phase 2 engine can analyze text fixtures, but UI only accepts files.                         | Add text/HTML paste box and analyze button.                                            | green                      |
| URL input                   | gray   | Static Pages cannot bypass CORS safely.                                                      | Add URL box that fetches CORS-allowed text and gives honest paste guidance on failure. | green with CORS limitation |
| Multi-file photos           | red    | Input only reads `files?.[0]`.                                                               | Allow multiple files, show per-file outcomes, keep best/latest result.                 | green                      |
| Sample/demo loader          | yellow | Default plan is a demo, but photo/text analysis has no sample entry point.                   | Add sample analysis using real fixture-like text.                                      | green                      |
| Imported state              | red    | No state file import.                                                                        | Add versioned state import with validation and migration.                              | green                      |
| Restored autosave           | yellow | Active plan restores from IndexedDB, but errors/migrations are not explicit.                 | Version persisted shape, validate, migrate/fallback visibly.                           | green                      |
| Deep links / share hash     | red    | No shareable state link.                                                                     | Add compact hash state for reasonably small plans.                                     | green                      |
| Folder upload               | gray   | Not needed for v1 user story; garden planning state is one project, not a folder workflow.   | Keep out of scope in ADR 0061.                                                         | gray                       |

## Real-user impact

The highest-friction issue was that the app asked users to own a very specific input path: a single image file. Phase 3 exposed the existing engine paths without changing the Phase 2 inference model.
