import { css } from "@linaria/core";
import { Spacing } from "@lifesg/react-design-system/theme";

export const gridContainer = css`
	padding: 0;
	gap: ${Spacing["spacing-32"]};
	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}
`;
