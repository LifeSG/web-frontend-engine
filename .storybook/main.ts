import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
	stories: ["../src/stories/**/*.stories.@(ts|tsx)", "../src/stories/**/*.mdx"],
	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-a11y",
		"@mihkeleidast/storybook-addon-source",
		"@storybook/addon-webpack5-compiler-swc",
	],
	staticDirs: ["../public"],
	webpackFinal: async (config) => {
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
	typescript: {
		reactDocgen: "react-docgen-typescript",
	},
};
export default config;
