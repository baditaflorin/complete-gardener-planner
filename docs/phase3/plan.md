# Phase 3 Completeness Plan

Ranked by real-user impact. Catalog references match the Phase 3 prompt.

| Rank | Catalog        | Item                                       | Outcome                                                        |
| ---- | -------------- | ------------------------------------------ | -------------------------------------------------------------- |
| 1    | 11, 38, 39, 41 | Versioned state export/import round-trip   | Users can move a plan between browsers and releases.           |
| 2    | 1, 2, 4, 5     | Multi-file image input with mobile capture | Users can load real phone photos and batches.                  |
| 3    | 1, 6           | Paste image/text input                     | Users can paste screenshots or garden notes directly.          |
| 4    | 3              | URL input with CORS-aware guidance         | Users get a useful result or a precise paste fallback.         |
| 5    | 7              | Sample loader as first-class input         | New users can test the analyzer without hunting for assets.    |
| 6    | 8, 40          | Resume and clear state                     | Users can recover and start fresh intentionally.               |
| 7    | 9, 14          | JSON/CSV outputs                           | Planner state and harvest projections leave the app.           |
| 8    | 10             | Copy planner summary                       | Users can paste a concise plan into messages/docs.             |
| 9    | 12             | Shareable hash URL                         | Small plans can be shared without a server.                    |
| 10   | 13             | Print/PDF view                             | Browser print becomes usable for garden notes.                 |
| 11   | 16, 18         | Finish kept half-baked controls            | Camera capture, debug copy, integration target.                |
| 12   | 17, 28, 30     | Delete starter assets and dormant noise    | Remove unused Vite files.                                      |
| 13   | 19, 42, 45     | README reality alignment                   | Claims match shipped behavior and limits.                      |
| 14   | 20, 21, 22, 23 | Shared domain helpers/schemas              | One source for plan validation, labels, and exports.           |
| 15   | 24, 25, 27, 32 | Planner module split                       | UI depends on application/domain helpers, not the reverse.     |
| 16   | 31, 33         | Error/status consistency                   | User-facing outcomes use stable, domain terms.                 |
| 17   | 35, 36, 37     | Type-safety at boundaries                  | Persisted/imported data is validated and parsed explicitly.    |
| 18   | 43             | Quickstart verification                    | README maps to `make smoke` and local preview.                 |
| 19   | 46             | Stranger test                              | Private-window cold flow recorded.                             |
| 20   | 47             | Fix top three stranger-test issues         | Release blocks until fixed.                                    |
| 21   | 29             | Resolve TODO/placeholder debt              | No placeholder target remains.                                 |
| 22   | 44             | Minimal inline help                        | Non-obvious import/share/paste affordances explain themselves. |

## Commit Strategy

- Docs/ADRs first.
- Input/output/persistence as feature commits.
- Refactors as separate commits after behavior is green.
- Version bump and publish as the final release commit/tag.
