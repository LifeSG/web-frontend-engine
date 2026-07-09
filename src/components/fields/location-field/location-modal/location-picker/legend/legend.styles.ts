import { Colour, Radius, Shadow, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const legendWrapper = css`
	max-width: 250px;
	position: absolute;
	display: flex;
	flex-direction: column;
	gap: ${Spacing["spacing-16"]};
	left: ${Spacing["spacing-24"]};
	bottom: ${Spacing["spacing-24"]};
	padding: ${Spacing["spacing-8"]} ${Spacing["spacing-16"]};
	background-color: ${Colour["bg"]};
	box-shadow: ${Shadow["xs-strong"]};
	border-radius: ${Radius["md"]};
`;

export const legendHeader = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const legendContent = css`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	max-height: 200px;
	max-width: 100%;
	width: max-content;
	overflow: auto;
	gap: ${Spacing["spacing-16"]};
`;

export const legendItem = css`
	display: flex;
	align-items: center;
	gap: ${Spacing["spacing-8"]};
`;

export const legendIcon = css`
	width: ${Spacing["spacing-24"]};
	height: ${Spacing["spacing-24"]};
	object-fit: contain;
	flex-shrink: 0;
`;

export const closeButton = css`
	padding: 0;
	background-color: transparent;

	height: ${Spacing["spacing-20"]};
	width: ${Spacing["spacing-20"]};

	> svg {
		color: ${Colour["icon"]};
	}
`;
