import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-webpack5";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
	stories: ["../src/stories/**/*.stories.@(ts|tsx)", "../src/stories/**/*.mdx"],
	addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-webpack5-compiler-swc"],
	features: { interactions: false, sidebarOnboardingChecklist: false },
	staticDirs: ["../public"],
	webpackFinal: async (config) => {
		config.module?.rules?.unshift({
			test: /\.(js|jsx|ts|tsx)$/,
			include: [path.resolve(__dirname, "../src"), path.resolve(__dirname, "../stories")],
			exclude: /node_modules/,
			use: [
				{
					loader: "@wyw-in-js/webpack-loader",
					options: {
						sourceMap: process.env.NODE_ENV !== "production",
					},
				},
			],
		});

		config.resolve!.modules = [path.resolve(__dirname, ".."), "node_modules"];

		return config;
	},
	framework: {
		name: "@storybook/react-webpack5",
		options: {},
	},
	swc: () => ({
		jsc: {
			transform: {
				react: {
					runtime: "automatic",
				},
			},
		},
	}),
};
export default config;
