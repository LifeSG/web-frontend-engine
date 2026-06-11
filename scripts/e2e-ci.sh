#!/bin/bash

# Exit immediately on error (-e), fail on unset variables (-u), and
# fail the whole pipeline if any piped command fails (-o pipefail).
# This makes CI failures deterministic and easier to debug.
set -euo pipefail

# Resolve the repository root from this script location so the script
# behaves the same regardless of the caller's current working directory.
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Change into the repository root and silence pushd output to keep
# logs focused on setup actions rather than directory stack noise.
pushd "$PROJECT_DIR" >/dev/null

# In CI, we build the library first so downstream E2E runs against the
# built artifact, which mirrors release behavior. Locally we skip the
# build to keep iteration fast while developing tests.
if [ "${CI:-}" = "true" ]; then
	echo "[E2E Setup] Building FEE package (CI mode)"
	./scripts/build.sh
else
	echo "[E2E Setup] Skipping build (dev mode - using source)"
fi

# Install dependencies for the Next.js E2E app.
echo "[E2E Setup] Installing Next app dependencies"
npm --prefix e2e/nextjs-app ci

# In CI we explicitly install the freshly built dist output into the
# Next.js app so tests validate the packaged artifact, not source files.
if [ "${CI:-}" = "true" ]; then
	echo "[E2E Setup] Installing built FEE package into Next app"
	npm --prefix e2e/nextjs-app install --no-save "$PROJECT_DIR/dist"
fi

# Run functional tests
echo "[CI] Running Playwright"
export CI=true
npx playwright test

# Return to the original directory and suppress directory stack output.
popd >/dev/null
