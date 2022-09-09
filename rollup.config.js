import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

// Override the base tsconfig.json during build
const overrides = {
	exclude: ["**/stories/**", "**/__tests__/**", "**/__mocks__/**", "**/util/**"],
};

export default {
	input: "src/index.tsx",
	output: [
		{
			dir: "dist",
			format: "cjs",
			sourcemap: true,
			chunkFileNames: "chunks/[name].[hash].js",
		},
	],
	plugins: [
		peerDepsExternal(), // Add the externals for me. [react, react-dom]
		resolve({ browser: true }),
		commonjs(),
		typescript({
			useTsconfigDeclarationDir: true,
			tsconfig: "tsconfig.json",
			tsconfigOverride: overrides,
		}),
		postcss(),
		image(),
		json(),
		terser(),
	],
};
