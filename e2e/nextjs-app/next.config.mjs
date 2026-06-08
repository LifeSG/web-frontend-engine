import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCI = process.env.CI === "true";

const workspaceRoot = path.resolve(__dirname, "../..");
const frontendEngineSourceRelative = "./src/index.ts";
const designSystemRelative = "./e2e/nextjs-app/node_modules/@lifesg/react-design-system";

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		externalDir: true,
	},
	turbopack: {
		root: workspaceRoot,
		resolveAlias: {
			...(isCI ? {} : { "@lifesg/web-frontend-engine": frontendEngineSourceRelative }),
			"@lifesg/react-design-system": designSystemRelative,
		},
	},
};

export default nextConfig;
