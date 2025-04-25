import { MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { Button } from "@lifesg/react-design-system/button";
import { Modal } from "@lifesg/react-design-system/modal";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";

interface SizeProps {
	size?: "large";
	width?: string;
}

export const ScrollableModal = styled(Modal)`
	height: 100%;
	overflow-y: auto;
`;

export const GrowContainer = styled.div`
	margin: auto;
	padding: 5rem ${Spacing["spacing-20"]};
	width: 100%;

	${MediaQuery.MaxWidth.sm} {
		padding: ${Spacing["spacing-16"]} ${Spacing["spacing-20"]};
	}
`;

export const Container = styled.div<SizeProps>`
	background: white;
	border-radius: ${Radius.md};
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: auto;
	max-width: ${(props) => (props.size === "large" ? "672px" : "426px")};
	width: 100%;
`;

export const PromptImage = styled.img`
	width: 11rem;
	margin: 0 auto ${Spacing["spacing-32"]};
`;

export const PromptButton = styled(Button.Default)<SizeProps>`
	width: ${({ width }) => width || "100%"};
	margin: 0 auto;

	&:not(:first-child):last-child {
		margin-top: ${Spacing["spacing-16"]};

		${MediaQuery.MinWidth.md} {
			margin-top: 0;
			margin-right: ${(props) => (props.size === "large" ? Spacing["spacing-32"] : Spacing["spacing-16"])};
		}
	}
`;

export const ButtonContainer = styled.div<SizeProps>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 ${Spacing["spacing-24"]} ${Spacing["spacing-64"]};

	${MediaQuery.MinWidth.md} {
		align-items: center;
		padding: ${(props) =>
			props.size === "large"
				? `${Spacing["spacing-32"]} ${Spacing["spacing-64"]} ${Spacing["spacing-64"]}`
				: `${Spacing["spacing-40"]} ${Spacing["spacing-24"]} ${Spacing["spacing-32"]}`};
		flex-direction: row-reverse;
	}
`;

export const LabelContainer = styled.div<SizeProps>`
	display: flex;
	flex-direction: column;
	text-align: center;
	padding: ${Spacing["spacing-64"]} ${Spacing["spacing-24"]} ${Spacing["spacing-24"]};

	${MediaQuery.MinWidth.md} {
		padding: ${(props) =>
			props.size === "large"
				? `${Spacing["spacing-64"]} ${Spacing["spacing-64"]} 0rem ${Spacing["spacing-64"]}`
				: `${Spacing["spacing-32"]} ${Spacing["spacing-24"]} 0`};
	}
`;

export const Description = styled(Typography.HeadingXS)`
	margin-top: ${Spacing["spacing-8"]};
`;

export const Title = styled(Typography.HeadingXS)<SizeProps>`
	margin-top: 0rem;
`;
