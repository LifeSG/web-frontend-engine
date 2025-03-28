import { V2_Color } from "@lifesg/react-design-system/v2_color";
import { V2_MediaQuery } from "@lifesg/react-design-system/v2_media";
import styled from "styled-components";

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

export const StaticMapWrapper = styled.div`
	width: ${staticMapDimensions.desktop.width / 16}rem;
	aspect-ratio: 3.55;
	margin-top: 2.375rem;
	border-radius: 4px;
	border: 1px solid ${V2_Color.Neutral[6]};
	overflow: hidden;

	${V2_MediaQuery.MaxWidth.mobileL} {
		aspect-ratio: 2.46;
		width: 100%;
	}
	${(props) => {
		if (props["aria-disabled"]) {
			return `cursor: not-allowed`;
		}
		return `cursor: pointer`;
	}}
`;

export const StaticMapElement = styled.img`
	display: block;
	width: 100%;
	height: auto;
`;
