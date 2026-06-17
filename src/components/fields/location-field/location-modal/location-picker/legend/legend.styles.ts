import { Button } from "@lifesg/react-design-system/button";
import { Colour, Radius, Shadow, Spacing } from "@lifesg/react-design-system/theme";
import styled from "styled-components";

export const LegendWrapper = styled.div`
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

export const LegendHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const LegendContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	max-height: 200px;
	max-width: 100%;
	width: max-content;
	overflow: auto;
	gap: ${Spacing["spacing-16"]};
`;

export const LegendItem = styled.div`
	display: flex;
	align-items: center;
	gap: ${Spacing["spacing-8"]};
`;

export const LegendIcon = styled.img`
	width: ${Spacing["spacing-24"]};
	height: ${Spacing["spacing-24"]};
	object-fit: contain;
	flex-shrink: 0;
`;

export const CloseButton = styled(Button)`
	padding: 0;
	background-color: transparent;

	height: ${Spacing["spacing-20"]};
	width: ${Spacing["spacing-20"]};

	> svg {
		color: ${Colour["icon"]};
	}
`;
