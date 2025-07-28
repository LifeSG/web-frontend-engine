import { Colour, MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";

export const Wrapper = styled.div`
	position: relative;
	display: block;
	border-radius: ${Radius.sm};
	padding: ${Spacing["spacing-32"]};

	${MediaQuery.MaxWidth.lg} {
		padding: ${Spacing["spacing-32"]} ${Spacing["spacing-20"]};
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
		const escapedColor = encodeURIComponent(Colour["border-focus-strong"](props));
		return `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='${escapedColor}' stroke-width='4' stroke-dasharray='8%2c 8' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e");`;
	}};
	background-color: ${Colour["bg-primary-subtlest"]};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
`;

export const HintText = styled(Typography.BodyMD)`
	color: ${Colour["text-selected"]};
`;
