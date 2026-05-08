# Postmortem

## What Was Built

V1 is a Mode B static GitHub Pages app with a Go data generator, versioned JSON artifacts, local garden storage, photo-analysis demo flow, SunCalc sun map, irrigation calculator, companion graph, crop rotation plan, harvest projections, docs, hooks, tests, and a Pages-ready build.

## Was Mode B Correct?

Yes. Mode A would have made reference data less maintainable, while Mode C would have added a server without a v1 need for auth, private writes, or runtime secrets. Mode B keeps the public surface static and still supports generated datasets and future release-hosted model files.

## What Worked

- GitHub Pages from `main:/docs` worked immediately.
- Static JSON artifacts were enough for a usable first planner.
- Browser-local persistence kept the UX simple and privacy-friendly.

## What Did Not Work

- Vite initially erased `docs/adr` and `docs/data` because the publish directory is also the docs directory. The build now cleans only generated asset files and regenerates data.
- Real PlantNet and disease ONNX binaries are too large to invent inside v1, so the UI ships a lazy ONNX adapter and deterministic fallback classifier.

## Surprises

- `onnxruntime-web` adds a large lazy WASM asset even when it is not part of the first load.
- Vite dev needed a small middleware to serve generated `docs/data/v1` under the Pages base path.

## Accepted Tech Debt

- Demo datasets are intentionally small.
- Photo analysis is a deterministic browser fallback until real model artifacts are published.
- Soil data is normalized as demo raster-like cells rather than full GDAL-backed tiles.

## Next Three Improvements

1. Publish real ONNX model artifacts in a GitHub Release and load them by tag.
2. Add an offline importer for USDA/EU plant data and public weather normals.
3. Add DuckDB-WASM querying for larger Parquet or SQLite artifacts.

## Time Spent Vs Estimate

Estimated: one focused bootstrap pass for a robust Mode B v1 scaffold.

Actual: one focused implementation pass, with extra time spent reconciling `docs/` as both documentation and Pages output.
