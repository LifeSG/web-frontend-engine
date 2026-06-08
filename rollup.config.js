import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";
import wyw from "@wyw-in-js/rollup";
import generatePackageJson from "rollup-plugin-generate-package-json";
import postcssUrl from "postcss-url";

const plugins = [
	peerDepsExternal(), // Add the externals for me. [react, react-dom]
	nodeResolve({ browser: true }),
	commonjs(), // converts CommonJS to ES6 modules
	typescript({
		include: ["**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts"],
		useTsconfigDeclarationDir: true,
		tsconfig: "tsconfig.json",
		tsconfigOverride: {
			// Override base tsconfig.json during build
			exclude: ["**/stories/**", "**/__tests__/**", "**/__mocks__/**", "**/util/**"],
		},
	}),
	postcss({
		extract: true,
		minimize: true,
		sourceMap: true,
		plugins: [
			postcssUrl({
				url: "inline",
			}),
		],
	}),
	wyw({
		sourceMap: true,
	}),
	image(),
	json(),
	terser(), // Helps remove comments, whitespace or logging codes
	{
		name: "inject-css-import",
		renderChunk(code, chunk, options) {
			// Only inject into entry chunks, not dynamic chunks
			if (chunk.isEntry) {
				const cssImport = options.format === "cjs" ? 'require("./index.css");' : 'import "./index.css";';
				return cssImport + "\n" + code;
			}
			return null;
		},
	},
	generatePackageJson({
		outputFolder: "dist",
		baseContents: (pkg) => ({
			name: pkg.name,
			version: pkg.version,
			description: pkg.description,
			keywords: pkg.keywords,
			homepage: pkg.homepage,
			bugs: pkg.bugs,
			license: pkg.license,
			repository: pkg.repository,
			engines: pkg.engines,
			typings: "./index.d.ts",
			main: "./cjs/index.js",
			module: "./index.js",
			style: "./index.css",
			dependencies: pkg.dependencies,
			peerDependencies: pkg.peerDependencies,
		}),
	}),
];

export default {
	input: "src/index.ts",
	output: [
		{
			dir: "dist",
			format: "esm",
			sourcemap: true,
			exports: "named",
			chunkFileNames: "chunks/[name].[hash].js",
		},
		{
			dir: "dist/cjs",
			format: "cjs",
			sourcemap: true,
			exports: "named",
			chunkFileNames: "chunks/[name].[hash].js",
		},
	],
	plugins,
	external: ["react", "react-dom", "styled-components", "@lifesg/react-design-system", "@lifesg/react-icons"],
};
