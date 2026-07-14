import { css } from "@linaria/core";
import { Spacing } from "@lifesg/react-design-system/theme";

// =============================================================================
// STYLING
// =============================================================================
export const tokens = {
	styledTextarea: {
		minHeight: "--fee-internal-textarea-styledTextarea-minHeight",
	},
};

export const wrapper = css`
	display: flex;
`;

export const wrapperChipPositionTop = css`
	flex-direction: column;
`;

export const wrapperChipPositionBottom = css`
	flex-direction: column-reverse;
`;

export const chipContainer = css`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-8"]};
`;

export const chipContainerChipPositionTop = css`
	margin: ${Spacing["spacing-8"]} 0 ${Spacing["spacing-16"]};
`;

export const chipContainerChipPositionBottom = css`
	margin: ${Spacing["spacing-16"]} 0 ${Spacing["spacing-8"]};
`;

export const styledTextarea = css`
	width: auto;
	${tokens.styledTextarea.minHeight}: initial;
`;

export const styledTextareaNotResizable = css`
	resize: none;
`;

export const styledTextareaResizable = css`
	resize: vertical;
	max-height: 37.5rem;
	min-height: var(${tokens.styledTextarea.minHeight}, 5rem);
`;
