#!/usr/bin/env bash
set -euo pipefail

PORT="${PAGES_PORT:-$(python3 - <<'PY'
import socket
with socket.socket() as s:
    s.bind(("127.0.0.1", 0))
    print(s.getsockname()[1])
PY
)}"
TMP_DIR="$(mktemp -d)"
SERVER_PID=""

cleanup() {
  if [[ -n "$SERVER_PID" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

npm run build
mkdir -p "$TMP_DIR/complete-gardener-planner"
cp -R docs/. "$TMP_DIR/complete-gardener-planner/"
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$TMP_DIR" >/tmp/complete-gardener-smoke.log 2>&1 &
SERVER_PID="$!"
sleep 0.2
if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
  cat /tmp/complete-gardener-smoke.log
  exit 1
fi

for _ in {1..40}; do
  if curl -fsS "http://127.0.0.1:${PORT}/complete-gardener-planner/" >/dev/null 2>&1; then
    break
  fi
  sleep 0.25
done

PLAYWRIGHT_BASE_URL="http://127.0.0.1:${PORT}/complete-gardener-planner/" npx playwright test
