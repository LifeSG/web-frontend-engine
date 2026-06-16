import type { NextConfig } from "next";
import path from "node:path";

const isCI = process.env.CI === "true";

// Turbopack must treat the monorepo/workspace root as its project root in this
// setup because some aliases and imports point outside `e2e/nextjs-app`.
// Using the workspace root avoids cross-filesystem resolution issues and keeps
// module graph construction consistent in local and CI runs.
const workspaceRoot = path.resolve(__dirname, "../..");

// Local-only alias target for the FEE package:
// when not running in CI, importing `@lifesg/web-frontend-engine` resolves to
// repository source for faster feedback during E2E iteration.
// In CI this alias is redirected to the installed package entry.
const frontendEngineSourceRelative = "./src/index.ts";
const frontendEnginePackageEntryRelative = "./e2e/nextjs-app/node_modules/@lifesg/web-frontend-engine/index.js";

// Force design-system resolution through the Next app's own node_modules path.
// This helps avoid duplicate package instances when the workspace root also
// contains related dependencies, which can otherwise cause styling/runtime
// inconsistencies in E2E runs.
const designSystemRelative = "./e2e/nextjs-app/node_modules/@lifesg/react-design-system";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	typescript: {
		// CI must use dependency resolution from node_modules instead of local
		// source aliases so E2E validates the published package behavior.
		tsconfigPath: isCI ? "tsconfig.ci.json" : "tsconfig.json",
	},
	// E2E browser runs in Docker and reaches the app via host.docker.internal.
	// Allow this dev origin so HMR websocket upgrades are not rejected.
	allowedDevOrigins: ["host.docker.internal"],
	experimental: {
		// Allow importing from outside the Next app directory (workspace source,
		// dist artifact installs, and other monorepo-adjacent paths).
		externalDir: true,
	},
	turbopack: {
		// Anchor Turbopack to the workspace boundary so alias paths are evaluated
		// against a predictable root rather than the app subdirectory.
		root: workspaceRoot,
		resolveAlias: {
			// Local: use source alias for rapid iteration.
			// CI: force resolution to installed package output.
			"@lifesg/web-frontend-engine": isCI ? frontendEnginePackageEntryRelative : frontendEngineSourceRelative,
			// Always pin design-system resolution to the app dependency tree.
			"@lifesg/react-design-system": designSystemRelative,
		},
	},
};

export default nextConfig;
