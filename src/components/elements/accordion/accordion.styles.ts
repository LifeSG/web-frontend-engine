import { css } from "@linaria/core";
import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";

export const container = css`
	padding: ${Spacing["spacing-32"]};
	${MediaQuery.MaxWidth.sm} {
		padding: ${Spacing["spacing-32"]} ${Spacing["spacing-20"]};
	}
`;
