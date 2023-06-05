import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const plugins = [
	peerDepsExternal(), // Add the externals for me. [react, react-dom]
	nodeResolve({ browser: true }),
	commonjs(), // converts CommonJS to ES6 modules
	typescript({
		useTsconfigDeclarationDir: true,
		tsconfig: "tsconfig.json",
		tsconfigOverride: {
			// Override base tsconfig.json during build
			exclude: ["**/stories/**", "**/__tests__/**", "**/__mocks__/**", "**/util/**"],
		},
	}),
	image(),
	json(),
	terser(), // Helps remove comments, whitespace or logging codes
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
