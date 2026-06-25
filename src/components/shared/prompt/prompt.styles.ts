import { css } from "@linaria/core";
import { MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";

export const tokens = {
	promptButton: {
		width: "--fds-internal-prompt-promptButton-width",
	},
};

export const scrollableModal = css`
	height: 100%;
	overflow-y: auto;
`;

export const growContainer = css`
	margin: auto;
	padding: 5rem ${Spacing["layout-md"]};
	width: 100%;

	${MediaQuery.MaxWidth.sm} {
		padding: ${Spacing["layout-sm"]} ${Spacing["layout-md"]};
	}
`;

export const container = css`
	${tokens.promptButton.width}: initial;

	background: white;
	border-radius: ${Radius.md};
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: auto;
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

export const promptButton = css`
	width: var(${tokens.promptButton.width});
	margin: 0 auto;

	&:not(:first-child):last-child {
		margin-top: ${Spacing["spacing-16"]};

		${MediaQuery.MinWidth.md} {
			margin-top: 0;
			margin-right: ${Spacing["spacing-16"]};
		}
	}
`;

export const promptButtonLarge = css`
	&:not(:first-child):last-child {
		${MediaQuery.MinWidth.md} {
			margin-right: ${Spacing["spacing-32"]};
		}
	}
`;

export const buttonContainer = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 ${Spacing["spacing-24"]} ${Spacing["spacing-64"]};

	${MediaQuery.MinWidth.md} {
		align-items: center;
		flex-direction: row-reverse;
		padding: ${Spacing["spacing-40"]} ${Spacing["spacing-24"]} ${Spacing["spacing-32"]};
	}
`;

export const buttonContainerLarge = css`
	${MediaQuery.MinWidth.md} {
		padding: ${Spacing["spacing-32"]} ${Spacing["spacing-64"]} ${Spacing["spacing-64"]};
	}
`;

export const labelContainer = css`
	display: flex;
	flex-direction: column;
	text-align: center;
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
