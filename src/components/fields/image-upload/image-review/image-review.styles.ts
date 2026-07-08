import { Border, Colour, Font, MediaQuery, Radius, Shadow, Spacing } from "@lifesg/react-design-system/theme";
import { Modal } from "@lifesg/react-design-system/modal";
import styled from "styled-components";
import { css } from "@linaria/core";

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
export const headerSection = css`
	display: flex;
	height: 2.75rem;
	text-align: center;
	align-items: center;
	flex-shrink: 0;
`;

export const headerSectionDrawActive = css`
	justify-content: space-between;
`;

export const reviewCloseButton = css`
	position: absolute;
	left: 0.5rem;
	padding: ${Spacing["spacing-4"]};
	min-width: unset;
	width: 3rem;
	background-color: transparent;
	outline-style: none;
	color: ${Colour["bg-primary"]};

	${MediaQuery.MaxWidth.sm}, [data-mobile-landscape="true"] & {
		height: 2.25rem;
	}
`;

export const reviewTitle = css`
	color: ${Colour["text-primary"]};
	margin: 0 auto;
`;

const buttonBaseStyles = `
	background: none;
	outline: 0;
	border: 0;
	flex-shrink: 0;
	cursor: pointer;
`;

export const editHeaderButton = css`
	${buttonBaseStyles}
	display: flex;
	color: ${Colour["text-primary"]};
	font-size: 1rem;
	padding: 0 ${Spacing["spacing-24"]};
	font-weight: ${Font.Spec["weight-semibold"]};
`;

// =============================================================================
// CONTENT
// =============================================================================
export const contentSection = css`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${Colour["bg-inverse"]};
	overflow: hidden;
	height: 31.25rem;
	${MediaQuery.MaxWidth.sm}, [data-mobile-landscape="true"] & {
		height: 100%;
	}
`;

export const loadingPreviewText = css`
	color: ${Colour["text-inverse"]};
	font-weight: ${Font.Spec["weight-semibold"]};
`;

export const drawDeleteButtonWrapper = css`
	position: absolute;
	right: 1.5rem;
	bottom: 1.5rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	${MediaQuery.MaxWidth.sm}, [data-mobile-landscape="true"] & {
		right: 1.25rem;
	}
`;

export const drawDeleteButton = css`
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

export const drawDeleteButtonText = css`
	color: ${Colour["text-primary"]};
	line-height: 1.75rem;
`;

export const drawDeleteButtonTextDisabled = css`
	color: ${Colour["text-subtler"]};
`;

export const drawIcon = css`
	color: ${Colour["icon-primary"]};
`;

export const drawIconDisabled = css`
	color: ${Colour.icon};
`;

export const deleteIcon = css`
	color: ${Colour["icon-primary"]};
`;

export const deleteIconDisabled = css`
	color: ${Colour.icon};
`;

export const imageEditorWrapper = css`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

// =============================================================================
// FOOTER
// =============================================================================
export const footerSection = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: ${Spacing["spacing-16"]} ${Spacing["spacing-24"]};

	${MediaQuery.MaxWidth.sm}, [data-mobile-landscape="true"] & {
		margin: 0 ${Spacing["spacing-20"]};
		height: 6.5rem;
		max-height: 6.5rem;
	}
`;

export const footerSaveButton = css`
	height: 3rem;
	margin-left: ${Spacing["spacing-16"]};
	min-width: 6.5rem;
	max-width: 7.125rem;
`;

export const eraserButton = css`
	${buttonBaseStyles}
	padding: 0;
	width: 3rem;
	height: 3rem;

	${MediaQuery.MaxWidth.sm} {
		width: 2.5rem;
		height: 2.5rem;
	}
`;

export const eraserButtonIcon = css`
	display: block;
	width: 100%;
	height: 100%;
	color: ${Colour.icon};
`;

export const eraserButtonIconEraseMode = css`
	color: ${Colour["icon-primary"]};
`;

export const buttonIcon = css`
	color: ${Colour["icon-inverse"]};
	width: 100%;
	height: 100%;
`;

export const buttonIconColorSchemeLight = css`
	color: ${Colour.icon};
`;

export const paletteHolder = css`
	display: flex;
	gap: ${Spacing["spacing-8"]};
	flex-direction: flex-end;
`;

export const palette = css`
	width: 3rem;
	height: 3rem;
	border-radius: ${Radius.sm};
	padding: ${Spacing["spacing-12"]};
	${tokens.palette.color}: initial;
	background-color: var(${tokens.palette.color});
	border: ${Border.solid} ${Border["width-010"]} var(${tokens.palette.color});
	cursor: pointer;

	${MediaQuery.MaxWidth.sm} {
		width: 2.5rem;
		height: 2.5rem;
		margin-left: ${Spacing["spacing-4"]};
	}
`;

export const paletteColorSchemeLight = css`
	border-color: #979797;
`;
