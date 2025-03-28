import { V2_Color } from "@lifesg/react-design-system/v2_color";
import { V2_MediaQuery } from "@lifesg/react-design-system/v2_media";
import { V2_Text } from "@lifesg/react-design-system/v2_text";
import styled from "styled-components";

export const Wrapper = styled.div`
	position: relative;
	display: block;
	border-radius: 0.25rem;
	padding: 2rem;

	${V2_MediaQuery.MaxWidth.tablet} {
		padding: 2rem 1.25rem;
	}
`;

export const HiddenInput = styled.input`
	display: none;
`;

export const HintContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* Generated background-image for the dashed border from https://kovart.github.io/dashed-border-generator/  */
	background-image: ${(props) => {
		const escapedColor = encodeURIComponent(V2_Color.Primary(props));
		return `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='${escapedColor}' stroke-width='4' stroke-dasharray='8%2c 8' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e");`;
	}};
	background-color: ${V2_Color.Accent.Light[6]};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
`;

export const HintText = styled(V2_Text.BodySmall)`
	color: ${V2_Color.Primary};
`;
