const path = require("path");

module.exports = {
	stories: [
		"../stories/**/*.stories.mdx",
		"../stories/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-a11y",

	],
	framework: "@storybook/react",
	webpackFinal: async (config, { configType }) => {
		config.resolve.modules = [path.resolve(__dirname, ".."), "node_modules"];
		// Removing the existing storybook css loaders because -> https://lifesaver.codes/answer/a-working-example-with-postcss-for-storybook-v5
		config.module.rules = config.module.rules.filter((f) => f.test.toString() !== "/\\.css$/");
		config.module.rules.push({
			test: /\.css$/,
			use: [
				"style-loader",
				{
					loader: "css-loader",
					options: { modules: false, importLoaders: 1 },
				},
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
		return config;
	},
}
