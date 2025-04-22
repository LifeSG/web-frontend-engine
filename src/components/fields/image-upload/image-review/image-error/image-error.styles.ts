import styled from "styled-components";
import { Button } from "@lifesg/react-design-system/button";
import { Breakpoint, Colour, Font } from "@lifesg/react-design-system/theme";
import { Typography } from "@lifesg/react-design-system/typography";

export const Wrapper = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background-color: black;
	padding: 2.5rem;
	text-align: center;

	@media (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		flex-direction: row;
	}
`;

export const ErrorIcon = styled.img`
	width: 100%;
	max-width: 9rem;
	height: auto;
	margin-bottom: 2rem;

	@media (orientation: landscape) and (max-height: ${Breakpoint["md-min"]}px) {
		margin: 0 2rem 0 0;
	}
`;

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
`;

export const BodyText = styled(Typography.BodyBL)`
	color: ${Colour["text-inverse"]};
	word-break: break-word;
`;

export const TitleText = styled(Typography.HeadingXS)`
	color: ${Colour["text-inverse"]};
	word-break: break-word;
`;

export const NameWrapper = styled.span`
	display: inline-block;
	font-weight: ${Font.Spec["weight-bold"]};
`;

export const OkButton = styled(Button.Default)`
	width: 100%;
	max-width: 16rem;
	margin-top: 2rem;

	@media (orientation: landscape) and (max-height: ${Breakpoint["md-min"]}px) {
		margin-top: 0.5rem;
	}
`;
