import { ThemeProvider } from "@lifesg/react-design-system/theme";
import "@lifesg/react-design-system/theme/styles/lifesg.css";
import type { Preview } from "@storybook/react-webpack5";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

const preview: Preview = {
	decorators: [
		(Story) => (
			<ThemeProvider theme="lifesg" mode="light">
				<Story />
			</ThemeProvider>
		),
	],
	parameters: {
		controls: { expanded: true },
		options: {
			storySort: {
				order: [
					"Introduction",
					["Getting Started", "Form Builder"],
					"Form",
					["Frontend Engine", "Validation Schema", "Conditional Rendering"],
				],
			},
		},
		layout: "centered",
		viewport: {
			options: INITIAL_VIEWPORTS,
		},
		docs: {
			codePanel: true,
		},
	},
	tags: ["autodocs"],
};

export default preview;
