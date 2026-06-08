import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCI = process.env.CI === "true";

const appRoot = __dirname;
const frontendEngineSourceRelative = "../../src/index.ts";
const designSystemRelative = "./node_modules/@lifesg/react-design-system";

const nextConfig = {
	reactStrictMode: true,
	turbopack: {
		root: appRoot,
		resolveAlias: {
			...(isCI ? {} : { "@lifesg/web-frontend-engine": frontendEngineSourceRelative }),
			"@lifesg/react-design-system": designSystemRelative,
		},
	},
};

export default nextConfig;
