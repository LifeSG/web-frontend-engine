#!/bin/bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

pushd "$PROJECT_DIR" >/dev/null

echo "[E2E Setup] Installing root dependencies"
npm ci

echo "[E2E Setup] Installing Next app dependencies"
npm --prefix e2e/nextjs-app ci

echo "[E2E Setup] Installing Playwright browser"
npx playwright install --with-deps chromium

popd >/dev/null
