import path from "node:path";
import { fileURLToPath } from "node:url";

// This config is authored as an ES module (`.mjs`), so Node does not provide
// `__filename` and `__dirname` automatically. We derive them explicitly from
// `import.meta.url` so all path calculations below remain stable regardless of
// where the process is launched from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCI = process.env.CI === "true";

// Turbopack must treat the monorepo/workspace root as its project root in this
// setup because some aliases and imports point outside `e2e/nextjs-app`.
// Using the workspace root avoids cross-filesystem resolution issues and keeps
// module graph construction consistent in local and CI runs.
const workspaceRoot = path.resolve(__dirname, "../..");

// Local-only alias target for the FEE package:
// when not running in CI, importing `@lifesg/web-frontend-engine` resolves to
// repository source for faster feedback during E2E iteration.
// In CI this alias is intentionally disabled so tests use the built package.
const frontendEngineSourceRelative = "./src/index.ts";

// Force design-system resolution through the Next app's own node_modules path.
// This helps avoid duplicate package instances when the workspace root also
// contains related dependencies, which can otherwise cause styling/runtime
// inconsistencies in E2E runs.
const designSystemRelative = "./e2e/nextjs-app/node_modules/@lifesg/react-design-system";

const nextConfig = {
	reactStrictMode: true,
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
			// CI: remove this alias so imports resolve to installed package output.
			...(isCI ? {} : { "@lifesg/web-frontend-engine": frontendEngineSourceRelative }),
			// Always pin design-system resolution to the app dependency tree.
			"@lifesg/react-design-system": designSystemRelative,
		},
	},
};

export default nextConfig;
