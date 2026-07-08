import { Border, Colour, Font, MediaQuery, Radius, Shadow, Spacing } from "@lifesg/react-design-system/theme";
import { Button } from "@lifesg/react-design-system/button";
import { Modal } from "@lifesg/react-design-system/modal";
import { Typography } from "@lifesg/react-design-system/typography";
import { BinIcon } from "@lifesg/react-icons/bin";
import { EraserIcon } from "@lifesg/react-icons/eraser";
import { PencilIcon } from "@lifesg/react-icons/pencil";
import { PencilStrokeIcon } from "@lifesg/react-icons/pencil-stroke";
import styled, { css } from "styled-components";

export const tokens = {
	palette: {
		color: "--fee-internal-imageReview-palette-color",
	},
};

interface IModalBoxStyle {
	imageReviewModalStyles?: string | undefined;
}

export const ModalBox = styled(Modal.Box)<IModalBoxStyle>`
	display: block;
	max-height: fit-content;

	${({ imageReviewModalStyles }) => {
		if (imageReviewModalStyles) return `${imageReviewModalStyles}`;
	}}

	${MediaQuery.MinWidth.xl} {
		max-width: 42rem;
		width: 100%;
	}
	${MediaQuery.MaxWidth.lg} {
		margin: 0 ${Spacing["spacing-20"]};
	}

	${MediaQuery.MaxWidth.sm}, &[data-mobile-landscape="true"] {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		width: 100%;
		max-width: none;
		max-height: none;
		margin: 0;
		border-radius: 0;
	}
`;

// =============================================================================
// HEADER
// =============================================================================
export const HeaderSection = styled.div`
	display: flex;
	height: 2.75rem;
	text-align: center;
	align-items: center;
	flex-shrink: 0;

	&.headerSectionDrawActive {
		justify-content: space-between;
	}
`;

export const ReviewCloseButton = styled(Button)`
	position: absolute;
	left: 0.5rem;
	padding: ${Spacing["spacing-4"]};
	min-width: unset;
	width: 3rem;
	background-color: transparent;
	outline-style: none;
	color: ${Colour["bg-primary"]};

	${MediaQuery.MaxWidth.sm}, ${ModalBox}[data-mobile-landscape="true"] & {
		height: 2.25rem;
	}
`;

export const ReviewTitle = styled(Typography.BodyMD)`
	color: ${Colour["text-primary"]};
	margin: 0 auto;
`;

const ButtonBase = css`
	background: none;
	outline: 0;
	border: 0;
	flex-shrink: 0;
	cursor: pointer;
`;

export const EditHeaderButton = styled.button`
	${ButtonBase}
	display: flex;
	color: ${Colour["text-primary"]};
	font-size: 1rem;
	padding: 0 ${Spacing["spacing-24"]};
	font-weight: ${Font.Spec["weight-semibold"]};
`;

// =============================================================================
// CONTENT
// =============================================================================
export const ContentSection = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${Colour["bg-inverse"]};
	overflow: hidden;
	height: 31.25rem;
	${MediaQuery.MaxWidth.sm}, ${ModalBox}[data-mobile-landscape="true"] & {
		height: 100%;
	}
`;

export const LoadingPreviewText = styled(Typography.HeadingXS)`
	color: ${Colour["text-inverse"]};
	font-weight: ${Font.Spec["weight-semibold"]};
`;

export const DrawDeleteButtonWrapper = styled.div`
	position: absolute;
	right: 1.5rem;
	bottom: 1.5rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	${MediaQuery.MaxWidth.sm}, ${ModalBox}[data-mobile-landscape="true"] & {
		right: 1.25rem;
	}
`;

export const DrawDeleteButton = styled(Button)`
	padding: 0;
	width: 5.4375rem;
	height: 2.5rem;
	gap: ${Spacing["spacing-4"]};
	background-color: ${Colour.bg};
	box-shadow: ${Shadow["sm-strong"]};
	border-radius: 1.25rem;

	&:first-child {
		margin-bottom: ${Spacing["spacing-16"]};
	}

	> svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	&:hover,
	&:disabled {
		background-color: ${Colour["bg-stronger"]};
	}

	&:selected {
		background-color: ${Colour["bg-selected"]};
	}
`;

export const DrawDeleteButtonText = styled(Typography.BodySM)`
	color: ${Colour["text-primary"]};
	line-height: 1.75rem;

	&.drawDeleteButtonTextDisabled {
		color: ${Colour["text-subtler"]};
	}
`;

export const DrawIcon = styled(PencilStrokeIcon)`
	color: ${Colour["icon-primary"]};

	&.drawIconDisabled {
		color: ${Colour.icon};
	}
`;

export const DeleteIcon = styled(BinIcon)`
	color: ${Colour["icon-primary"]};

	&.deleteIconDisabled {
		color: ${Colour.icon};
	}
`;

export const ImageEditorWrapper = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

// =============================================================================
// FOOTER
// =============================================================================
export const FooterSection = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: ${Spacing["spacing-16"]} ${Spacing["spacing-24"]};

	${MediaQuery.MaxWidth.sm}, ${ModalBox}[data-mobile-landscape="true"] & {
		margin: 0 ${Spacing["spacing-20"]};
		height: 6.5rem;
		max-height: 6.5rem;
	}
`;

export const FooterSaveButton = styled(Button)`
	height: 3rem;
	margin-left: ${Spacing["spacing-16"]};
	min-width: 6.5rem;
	max-width: 7.125rem;
`;

export const EraserButton = styled.button`
	${ButtonBase}
	padding: 0;
	width: 3rem;
	height: 3rem;

	${MediaQuery.MaxWidth.sm} {
		width: 2.5rem;
		height: 2.5rem;
	}
`;

export const EraserButtonIcon = styled(EraserIcon)`
	display: block;
	width: 100%;
	height: 100%;
	color: ${Colour.icon};

	&.eraserButtonIconEraseMode {
		color: ${Colour["icon-primary"]};
	}
`;

export const ButtonIcon = styled(PencilIcon)`
	color: ${Colour["icon-inverse"]};
	width: 100%;
	height: 100%;

	&.buttonIconColorSchemeLight {
		color: ${Colour.icon};
	}
`;

export const PaletteHolder = styled.div`
	display: flex;
	gap: ${Spacing["spacing-8"]};
	flex-direction: flex-end;
`;

export const Palette = styled.button`
	width: 3rem;
	height: 3rem;
	border-radius: ${Radius.sm};
	padding: ${Spacing["spacing-12"]};
	${tokens.palette.color}: initial;
	background-color: var(${tokens.palette.color});
	border: ${Border.solid} ${Border["width-010"]} var(${tokens.palette.color});
	cursor: pointer;

	&.paletteColorSchemeLight {
		border-color: #979797;
	}

	${MediaQuery.MaxWidth.sm} {
		width: 2.5rem;
		height: 2.5rem;
		margin-left: ${Spacing["spacing-4"]};
	}
`;
