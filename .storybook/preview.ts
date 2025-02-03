import { withJsx } from "@mihkeleidast/storybook-addon-source";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import type { Preview } from "@storybook/react";

const preview: Preview = {
	decorators: [withJsx],
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
			viewports: INITIAL_VIEWPORTS,
		},
	},
	tags: ["autodocs"],
};

export default preview;
