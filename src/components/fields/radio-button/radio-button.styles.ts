import { Colour, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const tokens = {
	toggleWrapper: {
		columns: "--fee-internal-radio-toggleWrapper-columns",
		flex: "--fee-internal-radio-toggleWrapper-flex",
		minItemWidth: "--fee-internal-radio-toggleWrapper-minItemWidth",
	},
};

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
	${tokens.toggleWrapper.flex}: initial;
	${tokens.toggleWrapper.minItemWidth}: initial;

	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-16"]};

	> * {
		flex: var(${tokens.toggleWrapper.flex}, initial);
		width: var(${tokens.toggleWrapper.minItemWidth}, auto);
	}
`;

export const gridToggleWrapper = css`
	${tokens.toggleWrapper.columns}: initial;
	${tokens.toggleWrapper.minItemWidth}: initial;

	display: grid;
	gap: ${Spacing["spacing-16"]};

	&:not([data-stretch]) {
		grid-template-columns: repeat(var(${tokens.toggleWrapper.columns}), auto);
		justify-content: start;
	}

	&[data-stretch] {
		grid-template-columns: repeat(
			var(${tokens.toggleWrapper.columns}, auto-fill),
			minmax(var(${tokens.toggleWrapper.minItemWidth}, 0), 1fr)
		);
	}
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

export const styledToggle = css`
	[data-id="toggle-composite-children"] {
		margin: 0;
		padding: 0;
	}
`;

export const styledToggleHasError = css`
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
