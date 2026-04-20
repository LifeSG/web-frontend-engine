import { IconButton } from "@lifesg/react-design-system/icon-button";
import { Color } from "@lifesg/react-design-system/color";
import styled from "styled-components";

export const LegendWrapper = styled.div`
	max-width: 250px;
	position: absolute;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	background-color: ${Color.Neutral[8]};
	box-shadow: 0 0 4px 1px rgb(from ${Color.Neutral[3]} r g b / 50%);
	border-radius: 0.5rem;
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
	gap: 1rem;
`;

export const LegendItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

export const LegendIcon = styled.img`
	width: 1.5rem;
	height: 1.5rem;
	object-fit: contain;
	flex-shrink: 0;
`;

export const CloseButton = styled(IconButton)`
	padding: 0;
	background-color: transparent;

	height: 1.25rem;
	width: 1.25rem;

	> svg {
		color: ${Color.Neutral[3]};
	}
`;
