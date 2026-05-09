# Phase 3 Input Pathway Audit

Status key: green = works end-to-end on real user data, yellow = partial, red = claimed or expected but broken, gray = intentionally not built.

| Entry point                 | Before | Evidence                                                                                     | Required Phase 3 action                                                                | After   |
| --------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------- |
| Single image upload         | green  | File picker accepts `image/*`; JPEG/PNG decode; HEIC/corrupt/oversize errors are actionable. | Keep and test.                                                                         | pending |
| Mobile camera picker        | yellow | `accept=image/*` opens file sources, but no `capture` hint for direct camera capture.        | Add `capture=environment` and document browser limitations.                            | pending |
| Drag and drop image         | red    | Drop zone is visually implied but has no drop handlers.                                      | Add drag/drop, route through same analyzer.                                            | pending |
| Paste image                 | red    | Clipboard paste is not handled.                                                              | Add paste handler and permission-safe fallback copy.                                   | pending |
| Paste text/HTML garden note | red    | Phase 2 engine can analyze text fixtures, but UI only accepts files.                         | Add text/HTML paste box and analyze button.                                            | pending |
| URL input                   | gray   | Static Pages cannot bypass CORS safely.                                                      | Add URL box that fetches CORS-allowed text and gives honest paste guidance on failure. | pending |
| Multi-file photos           | red    | Input only reads `files?.[0]`.                                                               | Allow multiple files, show per-file outcomes, keep best/latest result.                 | pending |
| Sample/demo loader          | yellow | Default plan is a demo, but photo/text analysis has no sample entry point.                   | Add sample analysis using real fixture-like text.                                      | pending |
| Imported state              | red    | No state file import.                                                                        | Add versioned state import with validation and migration.                              | pending |
| Restored autosave           | yellow | Active plan restores from IndexedDB, but errors/migrations are not explicit.                 | Version persisted shape, validate, migrate/fallback visibly.                           | pending |
| Deep links / share hash     | red    | No shareable state link.                                                                     | Add compact hash state for reasonably small plans.                                     | pending |
| Folder upload               | gray   | Not needed for v1 user story; garden planning state is one project, not a folder workflow.   | Keep out of scope in ADR 0061.                                                         | pending |

## Real-user impact

The highest-friction issue is that the app asks users to own a very specific input path: a single image file. The planner can already reason over garden text, weather CSV excerpts, and soil reports, but users cannot reach those capabilities through the UI. Phase 3 must expose the existing engine paths without changing the Phase 2 inference model.
