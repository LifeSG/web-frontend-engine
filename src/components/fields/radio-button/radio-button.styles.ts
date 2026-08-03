import { Colour, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const tokens = {
	flexToggleWrapper: {
		display: "--fee-internal-radio-flexToggleWrapper-display",
		gridTemplateColumns: "--fee-internal-radio-flexToggleWrapper-gridTemplateColumns",
		justifyContent: "--fee-internal-radio-flexToggleWrapper-justifyContent",
		flexDirection: "--fee-internal-radio-flexToggleWrapper-flexDirection",
		flexWrap: "--fee-internal-radio-flexToggleWrapper-flexWrap",
		childFlex: "--fee-internal-radio-flexToggleWrapper-childFlex",
		childWidth: "--fee-internal-radio-flexToggleWrapper-childWidth",
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
	display: var(${tokens.flexToggleWrapper.display}, flex);
	flex-direction: var(${tokens.flexToggleWrapper.flexDirection}, row);
	flex-wrap: var(${tokens.flexToggleWrapper.flexWrap}, wrap);
	grid-template-columns: var(${tokens.flexToggleWrapper.gridTemplateColumns}, none);
	justify-content: var(${tokens.flexToggleWrapper.justifyContent}, normal);
	gap: ${Spacing["spacing-16"]};

	> * {
		flex: var(${tokens.flexToggleWrapper.childFlex}, initial);
		width: var(${tokens.flexToggleWrapper.childWidth}, auto);
	}
`;

export const flexToggleWrapperHasError = css`
	/* No item selected — all items get error border */
	&:not(:has(input:checked)) > * {
		border-color: ${Colour["border-error"]};
	}

	/* An item is selected — unselected items revert to normal border */
	&:has(input:checked) > *:not(:has(input:checked)) {
		border-color: ${Colour.border};
	}
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
