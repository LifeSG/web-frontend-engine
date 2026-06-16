import { Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const chipContainer = css`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-8"]};
	margin: ${Spacing["spacing-8"]} 0;
`;

export const chipContainerShowTextarea = css`
	margin: ${Spacing["spacing-8"]} 0 ${Spacing["spacing-16"]};
`;
