import { Button } from "@lifesg/react-design-system/button";
import { MediaQuery } from "@lifesg/react-design-system/media";
import { Text } from "@lifesg/react-design-system/text";
import { TextList } from "@lifesg/react-design-system/text-list";
import styled from "styled-components";

interface SizeProps {
	size?: "large";
	width?: string;
}

export const Container = styled.div<SizeProps>`
	background: white;
	border-radius: 0.5rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 0rem 1rem;
	max-width: ${(props) => (props.size === "large" ? "672px" : "426px")};
	width: ${(props) => (props.size === "large" ? "672px" : "426px")};
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

		${MediaQuery.MinWidth.mobileL} {
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

	${MediaQuery.MinWidth.mobileL} {
		align-items: center;
		padding: ${(props) => (props.size === "large" ? "2rem 4rem 4rem" : "2.5rem 1.5rem 2rem")};
		flex-direction: row-reverse;
	}
`;

export const LabelContainer = styled.div<SizeProps>`
	display: flex;
	flex-direction: column;
	text-align: center;
	padding: 1.5rem;

	${MediaQuery.MinWidth.mobileL} {
		padding: ${(props) => (props.size === "large" ? "4rem 4rem 0rem 4rem" : "1rem 1.5rem 0")};
	}
`;

export const Description = styled(Text.H4)`
	margin-top: 0.5rem;
`;

export const UnorderedList = styled(TextList.Ul)``;

export const UnorderedListItem = styled(Text.BodySmall)`
	text-align: left;
`;

export const CallButton = styled.a`
	display: inline-block;
	font-family: open Sans semibold;
`;

export const BoldLetters = styled.strong`
	font-family: open Sans semibold;
`;

export const Title = styled(Text.H4)<SizeProps>`
	margin-top: ${(props) => (props.size === "large" ? "0rem" : "2rem")};
`;
