import { css } from "@linaria/core";
import { Spacing } from "@lifesg/react-design-system/theme";

export const customButton = css`
	> span {
		display: flex;
		align-items: center;
		gap: ${Spacing["spacing-8"]};
	}
`;
