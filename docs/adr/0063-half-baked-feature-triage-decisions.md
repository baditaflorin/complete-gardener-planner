# 0063 Half-Baked Feature Triage Decisions

## Status

Accepted.

## Context

Half-finished features confuse first-time users more than absent ones.

## Decision

| Feature             | Decision        | Rationale                                                         |
| ------------------- | --------------- | ----------------------------------------------------------------- |
| Snap garden photo   | Finish          | Add mobile camera capture hint and keep upload.                   |
| PlantNet-style flow | Finish honestly | Keep local ONNX-ready heuristic path and document limitation.     |
| Debug overlay       | Finish          | Add copy latest analysis JSON.                                    |
| Integration target  | Finish          | Replace placeholder wording with real fixture/e2e-backed command. |
| Starter assets      | Delete          | Unused Vite assets are noise.                                     |

## Consequences

The UI surface stays compact, but every visible promise has a handler.

## Alternatives Considered

- Hide photo analysis until a real PlantNet model exists: rejected because current Phase 2 inference is useful and honest.
- Keep starter assets for future marketing: rejected because git remembers deleted files.
