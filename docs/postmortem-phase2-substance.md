# Phase 2 Substance Postmortem

## Real-Data Pass Rate

Before: 2/10 useful first guesses, 5/10 visibly mishandled, 3/10 wrong-confident risks.

After: 8/10 useful first guesses, 2/10 recoverable failures with actionable next steps, 10/10 deterministic fixture outcomes.

| Fixture                       | Before                           | After                                                     |
| ----------------------------- | -------------------------------- | --------------------------------------------------------- |
| rd-01 clean tomato leaf       | Weak/filename dependent          | Tomato identified with medium confidence and reasons      |
| rd-02 cucumber powdery mildew | Partly right for shallow reasons | Cucumber + powdery mildew with host/visual reasons        |
| rd-03 tomato early blight     | Filename dependent               | Tomato + early blight with lesion/yellowing reasons       |
| rd-04 mixed raised bed        | Single-crop guess only           | Multi-crop suggestions for the bed                        |
| rd-05 basil downy mildew      | Generic mildew risk              | Basil + downy mildew host-aware ranking                   |
| rd-06 iPhone HEIC             | Generic decode failure           | Recoverable unsupported-format error                      |
| rd-07 truncated JPEG          | Generic decode failure           | Recoverable corrupt-image error                           |
| rd-08 soil report excerpt     | No useful inference              | pH/organic matter extracted and alkaline warning surfaced |
| rd-09 weather CSV excerpt     | No useful inference              | Weather fields recognized and diagnosed                   |
| rd-10 misleading filename     | Wrong-confident tomato risk      | Pepper preferred; tomato capped with conflict warning     |

## Top 5 Logic Gaps

1. Photo analysis was filename/color scoring. Closed with evidence normalization, plant aliases, visual signals, confidence, and reasons.
2. Mixed bed photos did not suggest crops. Closed with multi-crop shape detection and suggested crop IDs.
3. Disease ranking ignored host compatibility. Closed with host/disease boosts and incompatibility caps.
4. Frost/location/soil assumptions were disconnected. Improved by updating latitude, longitude, and nearest soil cell when frost zone changes.
5. Errors were not domain-actionable. Closed with recoverable input errors carrying what, why, and now what.

## Promised Smart Behaviors

- Photo input now produces plant, disease, crop suggestions, confidence, reasons, warnings, diagnostics, and provenance.
- Low confidence and conflicting evidence are visible rather than silently driving high-confidence output.
- Broken HEIC/corrupt inputs explain recovery in gardener terms.
- Re-running the same fixture produces byte-identical normalized inference output.

## Determinism Check

All 10 fixtures pass deterministic output checks. Error fixtures produce stable error kinds and recovery text.

## Performance Numbers

The real-data fixture test suite completes inference for all fixtures in under the average 20ms-per-fixture budget. Latest observed Vitest fixture run: 10 fixtures inside a 26ms test body on the local machine. Browser smoke remains under the pre-push budget.

## What Surprised Us

- The biggest improvement came from capping confidence, not from adding more guesses.
- Filename evidence is useful only after conflict detection; before that it is dangerous.
- The smoke script depended on Python, which hung in this environment, so the Pages preview server moved to Node.

## Still Open For Phase 3

1. Real ONNX model artifacts loaded by release tag.
2. A proper report/CSV input surface for soil and weather excerpts.
3. Worker-backed image sampling for very large photos.
4. Better real plant morphology signals beyond color ratios.
5. Export/re-import of inference provenance as canonical state.

## Honest Take

It no longer feels like a pure toy on the audited inputs. It now gives a useful first guess, explains itself, avoids high-confidence nonsense on misleading filenames, and recovers from broken uploads. It still feels thin where real PDFs, CSVs, and production image models are concerned because the UI does not yet ingest those as first-class inputs and the visual model is still heuristic.
