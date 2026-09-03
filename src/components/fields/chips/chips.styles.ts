import { css } from "@linaria/core";
import { Spacing } from "@lifesg/react-design-system/theme";

export const chipsContainer = css`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-8"]};
	margin: ${Spacing["spacing-8"]} 0;
`;

export const chipsContainerShowTextarea = css`
	margin: ${Spacing["spacing-8"]} 0 ${Spacing["spacing-16"]};
`;
