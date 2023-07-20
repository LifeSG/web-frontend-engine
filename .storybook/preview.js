import { withA11y } from "@storybook/addon-a11y";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

export const parameters = {
	viewport: {
		viewports: INITIAL_VIEWPORTS,
	},
	layout: "centered",
	controls: {
		expanded: true,
	},
	options: {
		storySort: {
			order: ["Introduction", "Form", ["Frontend Engine", "Validation Schema", "Conditional Rendering"]],
		},
	},
	decorators: [withA11y],
};
