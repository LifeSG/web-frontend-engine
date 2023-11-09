const path = require("path");
const webpack = require("webpack");

module.exports = {
	stories: ["../src/stories/**/*.stories.@(ts|tsx)", "../src/stories/**/*.mdx"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-a11y",
	],
	framework: "@storybook/react-webpack5",
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
