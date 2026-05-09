#!/usr/bin/env bash
set -euo pipefail

PORT="${PAGES_PORT:-4173}"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$TMP_DIR/complete-gardener-planner"
cp -R docs/. "$TMP_DIR/complete-gardener-planner/"

echo "Serving http://127.0.0.1:${PORT}/complete-gardener-planner/"
PAGES_ROOT="$TMP_DIR" node scripts/static-pages-server.mjs "$PORT"
