import { Border, Breakpoint, Colour, Font, MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { Button } from "@lifesg/react-design-system/button";
import { IconButton } from "@lifesg/react-design-system/icon-button";
import { Modal } from "@lifesg/react-design-system/modal";
import { Typography } from "@lifesg/react-design-system/typography";
import { BinIcon } from "@lifesg/react-icons/bin";
import { EraserIcon } from "@lifesg/react-icons/eraser";
import { PencilIcon } from "@lifesg/react-icons/pencil";
import { PencilStrokeIcon } from "@lifesg/react-icons/pencil-stroke";
import styled, { css } from "styled-components";

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

	${MediaQuery.MaxWidth.sm}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
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
export const HeaderSection = styled.div<{ $drawActive?: boolean }>`
	display: flex;
	height: 2.75rem;
	text-align: center;
	align-items: center;
	flex-shrink: 0;
	${({ $drawActive }) => ($drawActive ? "justify-content: space-between;" : "")}
`;

export const ReviewCloseButton = styled(IconButton)`
	position: absolute;
	left: 0.5rem;
	padding: ${Spacing["spacing-4"]};
	background-color: transparent;
	outline-style: none;
	> svg {
		font-size: 2rem;
		color: ${Colour["bg-primary"]};
	}

	${MediaQuery.MaxWidth.sm}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
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
	${MediaQuery.MaxWidth.sm}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
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

	${MediaQuery.MaxWidth.sm}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		right: 1.25rem;
	}
`;

export const DrawDeleteButton = styled(IconButton)`
	padding: 0;
	width: 5.4375rem;
	height: 2.5rem;
	background-color: ${Colour.bg};
	box-shadow: 0 0.125rem 0.25rem ${Colour["border-stronger"]}80;
	border-radius: 1.25rem;

	&:first-child {
		margin-bottom: ${Spacing["spacing-16"]};
	}

	> img {
		width: 1.5rem;
		height: 1.5rem;
	}

	&:hover,
	&:disabled {
		background-color: ${Colour["bg-stronger"]};
	}

	&:selected {
		background-color: ${Colour["bg-selected"]};
	}
`;

export const DrawDeleteButtonText = styled(Typography.BodySM)<{ $disabled: boolean }>`
	color: ${(props) => (props.$disabled ? Colour["text-subtler"] : Colour["text-primary"])};
	line-height: 1.75rem;
`;

export const DrawIcon = styled(PencilStrokeIcon)<{ $disabled: boolean }>`
	color: ${(props) => (props.$disabled ? Colour.icon : Colour["icon-primary"])};
	margin-right: ${Spacing["spacing-4"]};
`;

export const DeleteIcon = styled(BinIcon)<{ $disabled: boolean }>`
	color: ${(props) => (props.$disabled ? Colour.icon : Colour["icon-primary"])};
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
	margin: ${Spacing["spacing-16"]} ${Spacing["spacing-24"]} ${Spacing["spacing-16"]} ${Spacing["spacing-24"]};

	${MediaQuery.MaxWidth.sm}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		margin: 0 ${Spacing["spacing-20"]};
		height: 6.5rem;
		max-height: 6.5rem;
	}
`;

export const FooterSaveButton = styled(Button.Default)`
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

export const EraserButtonIcon = styled(EraserIcon)<{ $eraseMode: boolean }>`
	display: block;
	width: 100%;
	height: 100%;
	color: ${(props) => (props.$eraseMode ? Colour["icon-primary"] : Colour.icon)};
`;

export const ButtonIcon = styled(PencilIcon)<{ $colorScheme: string }>`
	color: ${(props) => (props.$colorScheme === "light" ? Colour.icon : Colour["icon-inverse"])};
	width: 100%;
	height: 100%;
`;

export const PaletteHolder = styled.div`
	display: flex;
	gap: ${Spacing["spacing-8"]};
	flex-direction: flex-end;
`;

export const Palette = styled.button<{ $color: string; $colorScheme?: string }>`
	width: 3rem;
	height: 3rem;
	border-radius: ${Radius.sm};
	padding: ${Spacing["spacing-12"]};
	background-color: ${({ $color }) => $color};
	border: ${Border.solid} ${Border["width-010"]}
		${({ $color, $colorScheme }) => ($colorScheme === "light" ? "#979797" : $color)};
	cursor: pointer;

	${MediaQuery.MaxWidth.sm} {
		width: 2.5rem;
		height: 2.5rem;
		margin-left: ${Spacing["spacing-4"]};
	}
`;
