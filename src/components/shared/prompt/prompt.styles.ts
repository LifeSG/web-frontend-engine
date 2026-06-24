import { MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { Button } from "@lifesg/react-design-system/button";
import { Modal } from "@lifesg/react-design-system/modal";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";

export const tokens = {
	promptButton: {
		width: "--fds-internal-prompt-promptButton-width",
	},
};

export const ScrollableModal = styled(Modal)`
	height: 100%;
	overflow-y: auto;
`;

export const GrowContainer = styled.div`
	margin: auto;
	padding: 5rem ${Spacing["layout-md"]};
	width: 100%;

	${MediaQuery.MaxWidth.sm} {
		padding: ${Spacing["layout-sm"]} ${Spacing["layout-md"]};
	}
`;

export const Container = styled.div`
	background: white;
	border-radius: ${Radius.md};
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: auto;
	max-width: 426px;
	width: 100%;

	&.containerLarge {
		max-width: 672px;
	}
`;

export const PromptImage = styled.img`
	width: 11rem;
	margin: 0 auto ${Spacing["spacing-32"]};
`;

export const PromptButton = styled(Button)`
	${tokens.promptButton.width}: initial;

	width: var(${tokens.promptButton.width});
	margin: 0 auto;

	&:not(:first-child):last-child {
		margin-top: ${Spacing["spacing-16"]};

		${MediaQuery.MinWidth.md} {
			margin-top: 0;
			margin-right: ${Spacing["spacing-16"]};
		}
	}

	&.promptButtonLarge:not(:first-child):last-child {
		${MediaQuery.MinWidth.md} {
			margin-right: ${Spacing["spacing-32"]};
		}
	}
`;

export const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 ${Spacing["spacing-24"]} ${Spacing["spacing-64"]};

	${MediaQuery.MinWidth.md} {
		align-items: center;
		flex-direction: row-reverse;
		padding: ${Spacing["spacing-40"]} ${Spacing["spacing-24"]} ${Spacing["spacing-32"]};
	}

	&.buttonContainerLarge {
		${MediaQuery.MinWidth.md} {
			padding: ${Spacing["spacing-32"]} ${Spacing["spacing-64"]} ${Spacing["spacing-64"]};
		}
	}
`;

export const LabelContainer = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	padding: ${Spacing["spacing-64"]} ${Spacing["spacing-24"]} ${Spacing["spacing-24"]};

	${MediaQuery.MinWidth.md} {
		padding: ${Spacing["spacing-32"]} ${Spacing["spacing-24"]} 0;
	}

	&.labelContainerLarge {
		${MediaQuery.MinWidth.md} {
			padding: ${Spacing["spacing-64"]} ${Spacing["spacing-64"]} 0rem ${Spacing["spacing-64"]};
		}
	}
`;

export const Description = styled(Typography.HeadingXS)`
	margin-top: ${Spacing["spacing-8"]};
`;

export const Title = styled(Typography.HeadingXS)`
	margin-top: 0rem;
`;
