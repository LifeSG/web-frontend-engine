import { Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const label = css`
	cursor: pointer;
`;

export const labelDisabled = css`
	cursor: not-allowed;
`;

export const checkbox = css`
	margin-right: ${Spacing["spacing-4"]};
	flex-shrink: 0;
`;

export const checkboxContainer = css`
	display: flex;
	align-items: center;
	&:not(:last-of-type) {
		margin-bottom: ${Spacing["spacing-16"]};
	}
`;

export const toggleWrapper = css`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-16"]};
`;

export const toggleWrapperVertical = css`
	flex-direction: column;
`;

export const toggle = css`
	[data-id="toggle-composite-children"] {
		margin: 0;
		padding: 0;
	}
`;
