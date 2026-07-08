import { Modal } from "@lifesg/react-design-system/modal";
import styled from "styled-components";
import { LocationPicker } from "./location-picker";
import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";
import { Typography } from "@lifesg/react-design-system/typography";

export const ModalBox = styled(Modal.Box)`
	flex-direction: row;
	width: 70%;
	max-width: 45rem;
	height: 40rem;

	// set z-index to get past safari border-radius issue
	z-index: 1;

	${MediaQuery.MaxWidth.lg} {
		flex-direction: column;
		height: 90%;
		max-height: 90%;
	}

	${MediaQuery.MaxWidth.sm}, &[data-mobile-landscape="true"] {
		height: 100%;
		width: 100%;
		flex-direction: column;
		max-width: none;
		max-height: none;
		border-radius: 0;
	}
`;

export const StyledLocationPicker = styled(LocationPicker)`
	width: 48.89%;

	${MediaQuery.MaxWidth.lg}, ${ModalBox}[data-mobile-landscape="true"] & {
		/* Keep map mounted but control visibility to prevent coordinate corruption */
		display: block;
		width: 100%;
		margin-top: ${Spacing["spacing-16"]};
		height: calc(100% - 13rem);
	}

	&.styledLocationPickerPanelMap {
		${MediaQuery.MaxWidth.lg}, ${ModalBox}[data-mobile-landscape="true"] & {
			visibility: visible;
			pointer-events: auto;
		}
	}

	&.styledLocationPickerPanelNotMap {
		${MediaQuery.MaxWidth.lg}, ${ModalBox}[data-mobile-landscape="true"] & {
			visibility: hidden;
			pointer-events: none;
		}
	}
`;

export const ErrorImage = styled.img`
	display: block;
	margin: 0 auto ${Spacing["spacing-32"]};
	width: 10.5rem;
	height: 8rem;

	${MediaQuery.MaxWidth.sm} {
		margin-top: ${Spacing["spacing-40"]};
	}
`;

export const PrefetchImage = styled.img`
	display: none;
`;

export const Description = styled(Typography.HeadingXS)`
	margin-top: ${Spacing["spacing-8"]};
`;
