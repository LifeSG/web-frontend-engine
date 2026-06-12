import { DashedBorder } from "@lifesg/react-design-system/dashed-border";
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

export const HintContainer = styled(DashedBorder)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
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
