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

# Create production build of library
LIB_VERSION=$(npm pkg get version | tr -d \")
echo ==============================================================================
echo "[E2E Setup] Building v$LIB_VERSION"
echo ==============================================================================
./scripts/build.sh

DS_LIB_VERSION=$(cd "${PROJECT_DIR}/node_modules/@lifesg/react-design-system"; npm pkg get version | tr -d \")

# Install the freshly built package
echo ==============================================================================
echo "[E2E Setup] Installing v$LIB_VERSION FEE package into Next app"
echo ==============================================================================
npm --prefix e2e/nextjs-app i "$PROJECT_DIR/dist/lifesg-web-frontend-engine-$LIB_VERSION.tgz" "@lifesg/react-design-system@$DS_LIB_VERSION"

# Run functional tests
echo ==============================================================================
echo "[CI] Running Playwright"
echo ==============================================================================
export CI=true
npx playwright test

# Return to the original directory and suppress directory stack output.
popd >/dev/null
