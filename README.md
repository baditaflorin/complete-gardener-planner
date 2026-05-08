# Complete Gardener Planner

Live site: https://baditaflorin.github.io/complete-gardener-planner/

Repository: https://github.com/baditaflorin/complete-gardener-planner

Support: https://www.paypal.com/paypalme/florinbadita

![Complete Gardener Planner demo](https://raw.githubusercontent.com/baditaflorin/complete-gardener-planner/main/docs/media/demo-screenshot.png)

Static-first planner for plant ID, crop rotation, sun, soil, watering, frost, and harvest forecasts. It is built for gardeners and urban farmers who want one offline-friendly place to turn photos, local growing conditions, and reference data into a practical bed plan.

## Quickstart

```bash
npm install
make install-hooks
make data
make build
make pages-preview
```

## What Works In V1

- Snap or upload a garden photo and get client-side plant and disease candidates.
- Pick crops, frost zone, soil cell, planting date, bed area, and shade.
- Generate a SunCalc-based sun map, watering schedule, crop rotation, companion-planting hints, and harvest projection.
- Fetch versioned static artifacts from `docs/data/v1/`.
- See the published version and latest GitHub commit in the page footer.

## Architecture

```mermaid
flowchart LR
  User["Gardener / urban farmer"] --> Pages["GitHub Pages static app"]
  Pages --> Browser["Browser compute and storage"]
  Browser --> IndexedDB["IndexedDB garden plan"]
  Browser --> Data["/data/v1 JSON artifacts"]
  Generator["Go build-data command"] --> Data
  ML["Optional Polars + scikit-learn trainer"] --> Data
```

Architecture docs: https://github.com/baditaflorin/complete-gardener-planner/blob/main/docs/architecture.md

ADRs: https://github.com/baditaflorin/complete-gardener-planner/tree/main/docs/adr

Data contract: https://github.com/baditaflorin/complete-gardener-planner/blob/main/docs/data.md

Deploy guide: https://github.com/baditaflorin/complete-gardener-planner/blob/main/docs/deploy.md

Privacy: https://github.com/baditaflorin/complete-gardener-planner/blob/main/docs/privacy.md
