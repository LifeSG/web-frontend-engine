import { MediaWidths } from "@lifesg/react-design-system/media";
import { MediaQuery } from "@lifesg/react-design-system/media";
import { Modal } from "@lifesg/react-design-system/modal";
import styled from "styled-components";
import { LocationPicker } from "./location-picker";
import { TSinglePanelInputMode } from "../types";

interface ISinglePanelStyle {
	singelPanelInputMode: TSinglePanelInputMode;
}

export const ModalBox = styled(Modal.Box)<{ mastheadHeight: number }>`
	flex-direction: row;
	width: 70%;
	max-width: 45rem;
	height: 40rem;

	// set z-index to get past safari border-radius issue
	z-index: 1;

	${MediaQuery.MaxWidth.tablet} {
		flex-direction: column;
		height: 90%;
		max-height: 90%;
	}

	${MediaQuery.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		height: 100%;
		width: 100%;
		${({ mastheadHeight }) => (mastheadHeight ? `padding-top: ${mastheadHeight / 16}rem;` : "")}
		flex-direction: column;
		max-width: none;
		max-height: none;
		border-radius: 0;
	}
`;

export const StyledLocationPicker = styled(LocationPicker)<ISinglePanelStyle>`
	width: 48.89%;

	${MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		display: ${({ singelPanelInputMode }) => (singelPanelInputMode !== "map" ? "none" : "block")};
		position: relative;
		left: 0;
		width: 100%;
		margin-top: 1rem;
		height: calc(100% - 13rem);
	}
`;

export const ErrorImage = styled.img`
	display: block;
	margin: 0 auto 2rem;
	width: 10.5rem;
	height: 8rem;

	${MediaQuery.MaxWidth.mobileL} {
		margin-top: 2.5rem;
	}
`;
