import { IconButton } from "@lifesg/react-design-system/icon-button";
import { Colour } from "@lifesg/react-design-system/theme";
import styled from "styled-components";

export const LegendWrapper = styled.div`
	position: absolute;
	left: 1.5rem;
	bottom: 1.5rem;
	max-width: 300px;
	padding: 0.5rem 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	background-color: white;
	box-shadow: 0 0 4px 1px rgba(104, 104, 104, 0.5);
	border-radius: 1rem;
	max-width: 250px;
`;

export const LegendHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	font-weight: bold;
`;

export const LegendContent = styled.div`
	max-height: 250px;
	overflow: auto;
	width: max-content;
	max-width: 100%;
	white-space: normal; /* allow wrapping */
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1rem;
`;

export const LegendItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

export const CloseButton = styled(IconButton)`
	padding: 0;
	background-color: transparent;
	outline-style: none;

	height: 1.25rem;
	width: 1.25rem;

	svg {
		color: ${Colour["icon"]};
	}

	&:hover {
		background-color: transparent;
	}
`;
