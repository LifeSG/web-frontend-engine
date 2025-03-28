import { Alert } from "@lifesg/react-design-system/alert";
import { Button } from "@lifesg/react-design-system/button";
import { V2_Color } from "@lifesg/react-design-system/v2_color";
import { V2_MediaQuery } from "@lifesg/react-design-system/v2_media";
import { V2_Text, V2_TextStyleHelper } from "@lifesg/react-design-system/v2_text";
import styled from "styled-components";

export interface SubtitleProps {
	$hasDescription?: boolean;
}

export const Wrapper = styled.div`
	border-radius: 0.25rem;
	${(props) => {
		const color = encodeURIComponent(V2_Color.Neutral[5](props));
		/* Generated background-image for the dashed border from https://kovart.github.io/dashed-border-generator/  */
		return `background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='${color}' stroke-width='4' stroke-dasharray='8%2c 8' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e");`;
	}}

	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;

export const Subtitle = styled(V2_Text.Body)<SubtitleProps>`
	margin-bottom: ${(props) => (props.$hasDescription ? "0.5rem" : "1rem")};
`;

export const Content = styled.div`
	${V2_TextStyleHelper.getTextStyle("BodySmall", "regular")}
	margin-bottom: 1.5rem;
	color: ${V2_Color.Neutral[3]};
`;

export const UploadWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-top: 2rem;
`;

export const AddButton = styled(Button.Small)`
	width: 100%;
	text-align: center;
	${V2_MediaQuery.MinWidth.mobileL} {
		width: 10rem;
		height: 2.5rem;
	}
`;

export const DropThemHereText = styled(Content)`
	margin-top: 0.5rem;
	display: none;
	${V2_MediaQuery.MinWidth.tablet} {
		display: block;
		width: 10rem;
		text-align: center;
	}
`;

export const AlertContainer = styled(Alert)`
	margin-top: 1rem;
	margin-bottom: 1rem;
`;
