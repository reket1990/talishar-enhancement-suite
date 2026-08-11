#!/usr/bin/env bash
# Dev watcher: reloads all unpacked Chrome extensions on any file change.
#
# Requirements (one-time setup):
#   1. brew install fswatch
#   2. Install the Chrome extension "Extensions Reloader":
#      https://chromewebstore.google.com/search/extensions%20reloader
#      (the one whose trigger URL is http://reload.extensions/)
#
# Usage: ./dev-watch.sh   (Ctrl+C to stop)
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v fswatch >/dev/null 2>&1; then
  echo "fswatch not found. Install with: brew install fswatch" >&2
  exit 1
fi

echo "Watching $(pwd) for changes. Ctrl+C to stop."
fswatch -o --latency=0.4 \
  --exclude='\.git($|/)' \
  --exclude='dev-watch\.sh$' \
  --exclude='\.DS_Store$' \
  . | while read -r _; do
  echo "[$(date +%H:%M:%S)] reloading extensions"
  open -a "Google Chrome" 'http://reload.extensions/' >/dev/null 2>&1 || true
done
