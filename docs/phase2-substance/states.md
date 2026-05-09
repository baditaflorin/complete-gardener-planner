# Phase 2 State Taxonomy

## Photo Analysis States

- `idle`: no file selected. Exit through upload.
- `validating`: file metadata is being checked. Exit to `analyzing`, `error-recoverable`, or `cancelled`.
- `analyzing`: image/evidence analysis is running. Exit to `ready`, `error-recoverable`, or `cancelled`.
- `ready`: inference result is available. Exit through new upload, apply suggestions, or correction.
- `error-recoverable`: user work is intact and a next step is shown. Exit through retry/new upload.
- `cancelled`: prior state is restored and the user can retry.

## Planner Data States

- `loading-static-data`: data artifacts are loading.
- `loaded-empty`: artifacts loaded but no selected crops.
- `loaded-some`: one to five selected crops.
- `loaded-many`: more than five selected crops; recommendations still run but warn about crowding.
- `error-fatal`: static data cannot load; retry is the only safe action.

Every state must have an intentional user-actionable exit.
