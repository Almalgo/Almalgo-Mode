#!/usr/bin/env bash
# Rebuilds .agents/agentic-loop-guide.pdf from .agents/loop-guide/index.html (?print mode)
# and records which .agents/ contents it was built from in pdf-source.sha256.
# Run after ANY change under .agents/, .cursor/agents/ or docs/agents/. check.mjs fails until you do.
#
# Uses local Chrome/Chromium when one runs; otherwise the Playwright Docker image (no npm install).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
GUIDE="$ROOT/.agents/loop-guide"
OUT="$ROOT/.agents/agentic-loop-guide.pdf"
IMAGE="${PLAYWRIGHT_IMAGE:-mcr.microsoft.com/playwright:v1.63.0-noble}"

node "$ROOT/.agents/skills/check.mjs" --skip-pdf
HASH="$(node "$ROOT/.agents/skills/check.mjs" --source-hash)"
QUERY="print&date=$(date -u +%F)&sha=$HASH"

# chrome-headless-shell first: full Chromium's new headless mode fails "Printing failed" on this
# page in the Playwright image (seen with chromium-1243), while headless-shell renders it.
local_chrome() {
  for c in chrome-headless-shell google-chrome google-chrome-stable chromium chromium-browser; do
    command -v "$c" >/dev/null && "$c" --headless --no-sandbox --version >/dev/null 2>&1 && { echo "$c"; return; }
  done
  return 1
}

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
if CHROME="$(local_chrome)"; then
  node "$GUIDE/render.mjs" "$CHROME" "file://$GUIDE/index.html?$QUERY" "$TMP/guide.pdf"
elif command -v docker >/dev/null; then
  docker run --rm --init --user "$(id -u):$(id -g)" -e HOME=/tmp \
    -v "$ROOT:/repo:ro" -v "$TMP:/out" "$IMAGE" \
    sh -c 'node /repo/.agents/loop-guide/render.mjs "$(ls -d /ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux*/chrome-headless-shell | head -1)" "$1" /out/guide.pdf' _ \
    "file:///repo/.agents/loop-guide/index.html?$QUERY"
else
  echo "Need Chrome/Chromium or Docker to render the PDF." >&2; exit 1
fi

[[ -s "$TMP/guide.pdf" ]] || { echo "PDF render failed." >&2; exit 1; }
mv "$TMP/guide.pdf" "$OUT"
echo "$HASH" > "$GUIDE/pdf-source.sha256"
node "$ROOT/.agents/skills/check.mjs"
echo "Wrote ${OUT#$ROOT/} ($(du -h "$OUT" | cut -f1))"
