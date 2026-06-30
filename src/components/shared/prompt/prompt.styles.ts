import { css } from "@linaria/core";
import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";

export const container = css`
	max-width: 426px;
	width: 100%;
`;

export const containerLarge = css`
	max-width: 672px;
`;

export const promptImage = css`
	width: 11rem;
	margin: 0 auto ${Spacing["spacing-32"]};
`;

export const buttonContainer = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 0;
	padding: 0 ${Spacing["spacing-24"]} ${Spacing["spacing-64"]};
	gap: ${Spacing["spacing-16"]};

	${MediaQuery.MinWidth.md} {
		flex-direction: row-reverse;
		padding: ${Spacing["spacing-40"]} ${Spacing["spacing-24"]} ${Spacing["spacing-32"]};
	}
`;

export const buttonContainerLarge = css`
	gap: ${Spacing["spacing-16"]};

	${MediaQuery.MinWidth.md} {
		gap: ${Spacing["spacing-32"]};
		padding: ${Spacing["spacing-32"]} ${Spacing["spacing-64"]} ${Spacing["spacing-64"]};
	}
`;

export const labelContainer = css`
	text-align: center;
	margin: 0;
	padding: ${Spacing["spacing-64"]} ${Spacing["spacing-24"]} ${Spacing["spacing-24"]};

	${MediaQuery.MinWidth.md} {
		padding: ${Spacing["spacing-32"]} ${Spacing["spacing-24"]} 0;
	}
`;

export const labelContainerLarge = css`
	${MediaQuery.MinWidth.md} {
		padding: ${Spacing["spacing-64"]} ${Spacing["spacing-64"]} 0rem ${Spacing["spacing-64"]};
	}
`;

export const description = css`
	margin-top: ${Spacing["spacing-8"]};
`;

export const title = css`
	margin-top: 0rem;
`;
