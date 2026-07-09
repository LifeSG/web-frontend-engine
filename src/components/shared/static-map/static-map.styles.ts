import { Colour, MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const staticMapDimensions = {
	desktop: {
		height: 120,
		width: 426,
	},
	mobile: {
		height: 120,
		width: 295,
	},
};

export const staticMapWrapper = css`
	width: ${staticMapDimensions.desktop.width / 16}rem;
	aspect-ratio: 3.55;
	margin-top: ${Spacing["spacing-40"]};
	border-radius: ${Radius.sm};
	border: 1px solid ${Colour.border};
	overflow: hidden;

	${MediaQuery.MaxWidth.sm} {
		aspect-ratio: 2.46;
		width: 100%;
	}

	&[data-disabled="true"] {
		cursor: not-allowed;
	}

	&[data-disabled="false"] {
		cursor: pointer;
	}
`;

export const staticMapElement = css`
	display: block;
	width: 100%;
	height: auto;
`;
