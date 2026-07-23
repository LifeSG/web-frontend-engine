import { css } from "@linaria/core";
import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";

export const tokens = {
	horizontalInset: "--fee-internal-arrayField-horizontalInset",
};

export const wrapper = css`
	${tokens.horizontalInset}: initial;
`;

export const inset = css`
	padding-left: var(${tokens.horizontalInset});
	padding-right: var(${tokens.horizontalInset});

	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}
`;

export const sectionHeader = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: ${Spacing["spacing-16"]};

	${MediaQuery.MaxWidth.sm} {
		flex-direction: column;
	}
`;

export const removeButton = css`
	padding-left: ${Spacing["spacing-32"]};
	padding-right: ${Spacing["spacing-32"]};

	${MediaQuery.MaxWidth.sm} {
		width: 100%;
	}
`;

export const removeButtonAlignRight = css`
	margin-left: auto;
`;

export const removeButtonAlignLeft = css`
	margin-right: auto;
`;

export const addButton = css`
	padding-left: ${Spacing["spacing-32"]};
	padding-right: ${Spacing["spacing-32"]};

	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}

	${MediaQuery.MaxWidth.sm} {
		width: 100%;
	}
`;

export const sectionDivider = css`
	margin: ${Spacing["spacing-32"]} 0;
`;

export const warningAlert = css`
	margin: 0;
`;

export const customErrorDisplay = css`
	margin-bottom: ${Spacing["spacing-32"]};
`;
