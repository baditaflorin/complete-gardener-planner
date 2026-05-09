# Phase 2 Substance Real-Data Audit

## Fixture Set

The audit fixture set spans clean, mildly messy, genuinely messy, broken, adversarial, huge, partial, and domain-edge inputs that real gardeners bring to the v1 surface area.

| ID    | Input                                                        | V1 behavior                                                       | Should do                                                   | Failure mode                   | Manual work forced         |
| ----- | ------------------------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------ | -------------------------- |
| rd-01 | Clean tomato leaf image from a plant profile                 | Often needs filename hint; green pixels can bias leafy crops      | Identify tomato with confidence and reasons                 | Wrong if filename is neutral   | Select Tomato manually     |
| rd-02 | Cucumber powdery mildew leaf photo                           | Can guess cucumber/mildew for shallow filename/brightness reasons | Host-aware cucumber + powdery mildew diagnosis              | Partly right for wrong reasons | Verify disease manually    |
| rd-03 | Tomato early blight photo/page                               | Filename "blight" helps; lesion pattern is not understood         | Detect brown concentric spotting and tomato host            | Brittle/wrong-confident        | Know the disease yourself  |
| rd-04 | Mixed raised-bed photo with tomato, basil, lettuce, marigold | Produces single top candidates; bed crop checkboxes unchanged     | Infer multiple visible crops and propose bed selections     | Visibly incomplete             | Tick every crop manually   |
| rd-05 | Basil downy mildew reference                                 | Generic mildew scoring may prefer powdery mildew                  | Use host/disease compatibility to prefer basil downy mildew | Wrong-but-confident            | Correct disease manually   |
| rd-06 | iPhone HEIC garden photo                                     | Browser decode can fail with generic image error                  | Explain unsupported HEIC and ask for JPEG/PNG               | Recoverable but unclear        | Diagnose format            |
| rd-07 | Truncated JPEG from chat transfer                            | Decode fails generically                                          | Explain corrupted/incomplete photo and preserve state       | Recoverable but unclear        | Guess the upload failed    |
| rd-08 | Extension soil test report text/PDF excerpt                  | No ingest; user picks demo soil cell                              | Extract pH/organic matter and surface soil warnings         | Missing domain intelligence    | Translate the report       |
| rd-09 | Weather normals CSV excerpt                                  | Static demo weather only                                          | Normalize rain/ET0/temp and explain limitations             | Missing domain intelligence    | Pick nearest zone manually |
| rd-10 | Misleading filename `tomato_leaf.jpg` on pepper/weed image   | Filename overpowers evidence                                      | Flag filename/visual conflict and lower confidence          | Wrong-but-confident            | Distrust the output        |

## Top 5 Logic Gaps

1. Photo analysis is filename/color scoring, not domain inference.
2. Multi-crop bed photos do not create useful crop-selection suggestions.
3. Host/disease compatibility is not part of disease ranking.
4. Frost, latitude/longitude, soil, weather, and sun assumptions are disconnected.
5. Failures lack domain-specific "what / why / now what" recovery guidance.

## Top 3 Intuition Failures

1. Uploading a bed photo does not update or suggest the bed crops.
2. Changing frost zone leaves location and related calculations feeling stale.
3. Unsupported/broken photos sound like browser errors, not gardener guidance.

## Top 3 Feels-Stupid Moments

1. The user uploads a photo and still has to tick every crop.
2. The user has clear disease/context clues and the app treats a filename as truth.
3. The user changes a region and the app does not infer the obvious local defaults.

## What Smart Means

- Photo input produces plant, disease, multi-crop, confidence, explanation, and plan-suggestion output immediately.
- Host/disease compatibility and domain vocabulary constrain guesses before they reach the planner.
- Low confidence is visible and blocks confident-sounding recommendations.
- Broken inputs explain what failed, why it matters, and the next step.
- Re-running the same fixture produces deterministic output with provenance.

## Phase 2 Substance Metrics

- At least 7 of 10 real-data fixtures produce a useful first guess without manual setup.
- All 10 fixtures produce byte-identical normalized inference output across repeated runs.
- No wrong-confident plant or disease candidate is emitted above 0.8 confidence.
- Every recoverable failure includes what failed, why, and now what.
- Median fixture inference time is under 20ms in unit tests and under 1s in the browser path for files under 5MB.
- Planner state coherence tests prove frost-zone changes update location defaults.

## Out of Scope

- No runtime backend, accounts, auth, sync, or Mode C escalation.
- No UI polish phase items.
- No full production PlantNet replacement.
- No universal soil/weather importer UI.
- No agronomic guarantees beyond transparent decision support.
