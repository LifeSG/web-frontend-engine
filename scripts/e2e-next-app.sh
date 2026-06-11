#!/bin/bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

pushd "$PROJECT_DIR" >/dev/null

if [ ! -x e2e/nextjs-app/node_modules/.bin/next ]; then
	echo "[E2E Next App] Installing Next app dependencies"
	npm --prefix e2e/nextjs-app ci
fi

if [ "${CI:-}" = "true" ]; then
	echo "[E2E Next App] Starting production server"
	npm --prefix e2e/nextjs-app run build
	npm --prefix e2e/nextjs-app run start
else
	echo "[E2E Next App] Starting dev server"
	npm --prefix e2e/nextjs-app run dev
fi

popd >/dev/null
