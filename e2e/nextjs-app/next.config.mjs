import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCI = process.env.CI === "true";

const appRoot = __dirname;
const frontendEngineSourceRelative = "../../src/index.ts";
const frontendEngineSourcePath = path.resolve(__dirname, frontendEngineSourceRelative);
const designSystemRelative = "./node_modules/@lifesg/react-design-system";
const designSystemPath = path.resolve(__dirname, designSystemRelative);

const nextConfig = {
	reactStrictMode: true,
	turbopack: {
		root: appRoot,
		resolveAlias: {
			...(isCI ? {} : { "@lifesg/web-frontend-engine": frontendEngineSourceRelative }),
			"@lifesg/react-design-system": designSystemRelative,
		},
	},
	webpack: (config) => {
		config.resolve = config.resolve ?? {};
		config.resolve.alias = config.resolve.alias ?? {};
		if (!isCI) {
			config.resolve.alias["@lifesg/web-frontend-engine"] = frontendEngineSourcePath;
		}
		config.resolve.alias["@lifesg/react-design-system"] = designSystemPath;
		return config;
	},
};

export default nextConfig;
