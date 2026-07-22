import { Colour, MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const wrapper = css`
	position: relative;
	display: block;
	border-radius: ${Radius.sm};
	padding: ${Spacing["spacing-32"]};

	${MediaQuery.MaxWidth.lg} {
		padding: ${Spacing["spacing-32"]} ${Spacing["spacing-20"]};
	}
`;

export const hiddenInput = css`
	display: none;
`;

export const hintContainer = css`
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

export const hintText = css`
	color: ${Colour["text-selected"]};
`;
