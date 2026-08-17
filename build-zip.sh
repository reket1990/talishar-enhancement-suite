#!/usr/bin/env bash
# Package the extension into a Chrome Web Store upload zip.
# Usage: ./build-zip.sh
set -euo pipefail
cd "$(dirname "$0")"

VERSION=$(python3 -c "import json; print(json.load(open('manifest.json'))['version'])")

BUILDS_DIR="builds"
ZIP_NAME="talishar-enhancement-suite-v${VERSION}.zip"
ZIP_PATH="${BUILDS_DIR}/${ZIP_NAME}"

mkdir -p "$BUILDS_DIR"
rm -f "$ZIP_PATH"

# Include only files the extension needs at runtime. Dev tools
# (dev-watch.sh, build-zip.sh, .git, .claude, .gitignore) are omitted.
zip -r "$ZIP_PATH" \
  manifest.json \
  background.js \
  content.js \
  page-hook.js \
  popup.html \
  popup.css \
  popup.js \
  icons/ \
  -x "*.DS_Store"

echo ""
echo "Created: $ZIP_PATH ($(du -h "$ZIP_PATH" | cut -f1))"
