import styled from "styled-components";
import { Button } from "@lifesg/react-design-system/button";
import { V2_Color } from "@lifesg/react-design-system/v2_color";
import { V2_MediaWidths } from "@lifesg/react-design-system/v2_media";

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

	@media (orientation: landscape) and (max-height: ${V2_MediaWidths.mobileL}px) {
		flex-direction: row;
	}
`;

export const ErrorIcon = styled.img`
	width: 100%;
	max-width: 9rem;
	height: auto;
	margin-bottom: 2rem;

	@media (orientation: landscape) and (max-height: ${V2_MediaWidths.mobileL}px) {
		margin: 0 2rem 0 0;
	}
`;

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
`;

export const BodyText = styled.div`
	color: ${V2_Color.Neutral[8]};
	word-break: break-word;
`;

export const NameWrapper = styled.span`
	display: inline-block;
	font-weight: bold;
`;

export const OkButton = styled(Button.Default)`
	width: 100%;
	max-width: 16rem;
	margin-top: 2rem;

	@media (orientation: landscape) and (max-height: ${V2_MediaWidths.mobileL}px) {
		margin-top: 0.5rem;
	}
`;
