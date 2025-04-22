import { Modal } from "@lifesg/react-design-system/modal";
import styled from "styled-components";
import { TPanelInputMode } from "../types";
import { LocationPicker } from "./location-picker";
import { Breakpoint, MediaQuery } from "@lifesg/react-design-system";

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

	${MediaQuery.MaxWidth.lg} {
		flex-direction: column;
		height: 90%;
		max-height: 90%;
	}

	${MediaQuery.MaxWidth.sm}, (orientation: landscape) and (max-height: ${Breakpoint["md-min"]}px) {
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

	${MediaQuery.MaxWidth.lg}, (orientation: landscape) and (max-height: ${Breakpoint["md-min"]}px) {
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

	${MediaQuery.MaxWidth.sm} {
		margin-top: 2.5rem;
	}
`;

export const PrefetchImage = styled.img`
	display: none;
`;
