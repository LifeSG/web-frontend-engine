import { V2_MediaQuery, V2_MediaWidths } from "@lifesg/react-design-system/v2_media";
import { Modal } from "@lifesg/react-design-system/modal";
import styled from "styled-components";
import { TPanelInputMode } from "../types";
import { LocationPicker } from "./location-picker";

interface ISinglePanelStyle {
	panelInputMode: TPanelInputMode;
}

interface IModalBoxStyle {
	locationModalStyles?: string | undefined;
}

export const ModalBox = styled(Modal.Box)<IModalBoxStyle>`
	flex-direction: row;
	width: 70%;
	max-width: 45rem;
	height: 40rem;

	// set z-index to get past safari border-radius issue
	z-index: 1;

	${({ locationModalStyles }) => {
		if (locationModalStyles) return `${locationModalStyles}`;
	}}

	${V2_MediaQuery.MaxWidth.tablet} {
		flex-direction: column;
		height: 90%;
		max-height: 90%;
	}

	${V2_MediaQuery.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${V2_MediaWidths.mobileL}px) {
		height: 100%;
		width: 100%;
		flex-direction: column;
		max-width: none;
		max-height: none;
		border-radius: 0;
	}
`;

export const StyledLocationPicker = styled(LocationPicker)<ISinglePanelStyle>`
	width: 48.89%;

	${V2_MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${V2_MediaWidths.mobileL}px) {
		display: ${({ panelInputMode }) => (panelInputMode !== "map" ? "none" : "block")};
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

	${V2_MediaQuery.MaxWidth.mobileL} {
		margin-top: 2.5rem;
	}
`;

export const PrefetchImage = styled.img`
	display: none;
`;
