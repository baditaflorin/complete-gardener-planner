# 0061 Input Pathway Coverage Policy

## Status

Accepted.

## Context

Users bring photos, screenshots, pasted notes, soil reports, weather snippets, and saved project files. Phase 2 had engine support for several evidence shapes, but the UI exposed only one image file path.

## Decision

The UI will support:

- Single and multi-file image uploads.
- Mobile camera capture hints through the file input.
- Drag/drop images.
- Paste images and text/HTML.
- CORS-allowed URL text fetch with honest fallback guidance.
- Sample evidence loading.
- Versioned state-file import.
- Hash share-state restore.

Folder upload remains out of scope because the app manages one garden plan at a time.

## Consequences

All analysis pathways route through the same Phase 2 inference functions. URL fetch failures are not hidden; users are told to paste rendered page text when the browser blocks CORS.

## Alternatives Considered

- Proxy URL fetching through a backend: rejected to preserve Mode B.
- Add a file-system folder workflow: rejected as unrelated to the core planner story.
