import { MediaQuery, Radius } from "@lifesg/react-design-system/theme";
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
	padding: 5rem 1.25rem;
	width: 100%;

	${MediaQuery.MaxWidth.sm} {
		padding: 1rem 1.25rem;
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
	margin: 0 auto 2rem;
`;

export const PromptButton = styled(Button.Default)<SizeProps>`
	width: ${({ width }) => width || "100%"};
	margin: 0 auto;

	&:not(:first-child):last-child {
		margin-top: 1rem;

		${MediaQuery.MinWidth.md} {
			margin-top: 0;
			margin-right: ${(props) => (props.size === "large" ? "2rem" : "1rem")};
		}
	}
`;

export const ButtonContainer = styled.div<SizeProps>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 1.5rem 4rem;

	${MediaQuery.MinWidth.md} {
		align-items: center;
		padding: ${(props) => (props.size === "large" ? "2rem 4rem 4rem" : "2.5rem 1.5rem 2rem")};
		flex-direction: row-reverse;
	}
`;

export const LabelContainer = styled.div<SizeProps>`
	display: flex;
	flex-direction: column;
	text-align: center;
	padding: 4rem 1.5rem 1.5rem;

	${MediaQuery.MinWidth.md} {
		padding: ${(props) => (props.size === "large" ? "4rem 4rem 0rem 4rem" : "2rem 1.5rem 0")};
	}
`;

export const Description = styled(Typography.HeadingXS)`
	margin-top: 0.5rem;
`;

export const Title = styled(Typography.HeadingXS)<SizeProps>`
	margin-top: 0rem;
`;
