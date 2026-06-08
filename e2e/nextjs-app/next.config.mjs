import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== "production";
const isCI = process.env.CI === "true";

const appRoot = __dirname;
const frontendEngineEntry = isCI ? "../../dist/index.js" : "../../src/index.ts";
const frontendEngineEntryRelative = isCI ? "../../dist/index.js" : "../../src/index.ts";
const frontendEngineEntryPath = path.resolve(__dirname, frontendEngineEntry);
const designSystemRelative = "./node_modules/@lifesg/react-design-system";
const designSystemPath = path.resolve(__dirname, designSystemRelative);

const nextConfig = {
	reactStrictMode: true,
	turbopack: {
		root: appRoot,
		resolveAlias: {
			"@lifesg/web-frontend-engine": frontendEngineEntryRelative,
			"@lifesg/react-design-system": designSystemRelative,
		},
	},
	webpack: (config) => {
		config.resolve = config.resolve ?? {};
		config.resolve.alias = config.resolve.alias ?? {};
		config.resolve.alias["@lifesg/web-frontend-engine"] = frontendEngineEntryPath;
		config.resolve.alias["@lifesg/react-design-system"] = designSystemPath;
		return config;
	},
};

export default nextConfig;
