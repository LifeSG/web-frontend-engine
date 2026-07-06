import { css } from "@linaria/core";
import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";

export const tokens = {
	box: { rowGap: "--fee-internal-review-box-rowGap" },
};

export const customUneditableSection = css`
	padding: ${Spacing["spacing-32"]};
	${MediaQuery.MaxWidth.sm} {
		padding: ${Spacing["spacing-20"]};
	}
`;

export const boxUneditableSection = css`
	${tokens.box.rowGap}: initial;

	ul {
		row-gap: var(${tokens.box.rowGap});
	}
`;
