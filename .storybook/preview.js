import { withA11y } from "@storybook/addon-a11y";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { addDecorator } from "@storybook/react";

export const parameters = {
	viewport: {
		viewports: INITIAL_VIEWPORTS,
	},
	layout: "centered",
	controls: {
		expanded: true,
	},
}

addDecorator(withA11y);
