import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== "production";

const appRoot = __dirname;
const frontendEngineSourceRelative = "../../src/index.ts";
const frontendEngineSource = path.resolve(__dirname, "../../src/index.ts");
const designSystemRelative = "./node_modules/@lifesg/react-design-system";
const designSystemPath = path.resolve(__dirname, designSystemRelative);

const nextConfig = {
	reactStrictMode: true,
	turbopack: {
		root: appRoot,
		resolveAlias: {
			"@lifesg/web-frontend-engine": frontendEngineSourceRelative,
			"@lifesg/react-design-system": designSystemRelative,
		},
	},
	webpack: (config) => {
		config.resolve = config.resolve ?? {};
		config.resolve.alias = config.resolve.alias ?? {};
		config.resolve.alias["@lifesg/web-frontend-engine"] = frontendEngineSource;
		config.resolve.alias["@lifesg/react-design-system"] = designSystemPath;
		return config;
	},
};

export default nextConfig;
