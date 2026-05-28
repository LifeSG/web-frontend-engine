import { INITIAL_VIEWPORTS } from "storybook/viewport";
import type { Preview } from "@storybook/react-webpack5";

const preview: Preview = {
	decorators: [],
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
