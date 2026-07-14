import { css } from "@linaria/core";
import { Spacing } from "@lifesg/react-design-system/theme";

export const label = css`
	cursor: pointer;
`;

export const labelDisabled = css`
	cursor: not-allowed;
`;

export const styledRadioButton = css`
	margin-right: ${Spacing["spacing-4"]};
	flex-shrink: 0;
`;

export const styledImageButton = css`
	flex: 1;

	img {
		min-width: 3.5rem;
	}
`;

export const radioContainer = css`
	display: flex;
	align-items: center;

	&:not(:last-of-type) {
		margin-bottom: ${Spacing["spacing-16"]};
	}
`;

export const flexImageWrapper = css`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-16"]};
`;

export const flexToggleWrapper = css`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-16"]};
`;

export const flexToggleWrapperVertical = css`
	flex-direction: column;
`;

export const styledToggle = css`
	[data-id="toggle-composite-children"] {
		margin: 0;
		padding: 0;
	}
`;
