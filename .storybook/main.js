const path = require("path");
const webpack = require("webpack");

module.exports = {
	stories: ["../src/stories/**/*.stories.@(ts|tsx|mdx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-a11y",
	],
	typescript: {
		reactDocgen: "react-docgen-typescript",
	},
	framework: {
		name: "@storybook/react-webpack5",
		options: {},
	},
	docs: {
		autodocs: true,
		defaultName: "Docs",
	},
	webpackFinal: async (config) => {
		config.resolve.modules = [path.resolve(__dirname, ".."), "node_modules"];
		config.module.rules.push({
			test: /\.css$/,
			use: [
				{
					loader: "postcss-loader",
					options: {
						postcssOptions: {
							plugins: ["postcss-import"],
						},
					},
				},
			],
			include: path.resolve(__dirname, "../"),
		});
		config.plugins.push(
			new webpack.ProvidePlugin({
				Buffer: ["buffer", "Buffer"],
			})
		);
		return config;
	},
};
