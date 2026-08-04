import { Colour, Spacing } from "@lifesg/react-design-system/theme";
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

export const toggleWrapperHasError = css`
	/* No item selected — all items get error border */
	&:not(:has(input:checked)) > * {
		border-color: ${Colour["border-error"]};
	}

	/* An item is selected — unselected items revert to normal border */
	&:has(input:checked) > *:not(:has(input:checked)) {
		border-color: ${Colour.border};
	}
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

export const toggleHasError = css`
	&:has(input:checked) {
		background: ${Colour["bg-error"]};
		border-color: ${Colour["border-error"]};

		label,
		span {
			color: ${Colour["text-error"]};
		}

		svg {
			color: ${Colour["icon-error"]};
		}
	}
`;
