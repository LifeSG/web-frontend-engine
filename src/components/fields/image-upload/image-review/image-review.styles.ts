import { Button } from "@lifesg/react-design-system/button";
import { Color } from "@lifesg/react-design-system/color";
import { IconButton } from "@lifesg/react-design-system/icon-button";
import { MediaQuery, MediaWidths } from "@lifesg/react-design-system/media";
import { Modal } from "@lifesg/react-design-system/modal";
import { Text } from "@lifesg/react-design-system/text";
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

	${MediaQuery.MinWidth.tablet} {
		max-width: 42rem;
		width: 100%;
	}
	${MediaQuery.MaxWidth.tablet} {
		margin: 0 1.25rem;
	}

	${MediaQuery.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
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
export const HeaderSection = styled.div<{ drawActive?: boolean }>`
	display: flex;
	height: 2.75rem;
	text-align: center;
	align-items: center;
	flex-shrink: 0;
	${({ drawActive }) => (drawActive ? "justify-content: space-between;" : "")}
`;

export const ReviewCloseButton = styled(IconButton)`
	position: absolute;
	left: 0.5rem;
	padding: 0.25rem;
	background-color: transparent;
	outline-style: none;
	> svg {
		font-size: 2rem;
		color: ${Color.Primary};
	}

	${MediaQuery.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		height: 2.25rem;
	}
`;

export const ReviewTitle = styled(Text.H5)`
	font-weight: 600;
	color: ${Color.Primary};
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
	color: ${Color.Primary};
	font-size: 1rem;
	padding: 0 1.5rem;
	font-weight: 600;
`;

// =============================================================================
// CONTENT
// =============================================================================
export const ContentSection = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: black;
	overflow: hidden;
	height: 31.25rem;
	${MediaQuery.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		height: 100%;
	}
`;

export const LoadingPreviewText = styled(Text.H4)`
	color: white;
`;

export const DrawDeleteButtonWrapper = styled.div`
	position: absolute;
	right: 1.5rem;
	bottom: 1.5rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	${MediaQuery.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		right: 1.25rem;
	}
`;

export const DrawDeleteButton = styled(IconButton)`
	padding: 0;
	width: 5.4375rem;
	height: 2.5rem;
	background-color: white;
	box-shadow: 0 0.125rem 0.25rem ${Color.Neutral[3]}80;
	border-radius: 1.25rem;

	&:first-child {
		margin-bottom: 1rem;
	}

	> img {
		width: 1.5rem;
		height: 1.5rem;
	}

	&:hover,
	&:disabled {
		background-color: ${Color.Neutral[6]};
	}

	&:selected {
		background-color: ${Color.Accent.Light[5]};
	}
`;

export const DrawDeleteButtonText = styled(Text.H6)<{ disabled: boolean }>`
	color: ${(props) => (props.disabled ? Color.Neutral[3] : Color.Primary)};
	line-height: 1.75rem;
`;

export const DrawIcon = styled(PencilStrokeIcon)<{ disabled?: boolean }>`
	color: ${(props) => (props.disabled ? Color.Neutral[3] : Color.Primary)};
	margin-right: 0.25rem;
`;

export const DeleteIcon = styled(BinIcon)<{ disabled?: boolean }>`
	color: ${(props) => (props.disabled ? Color.Neutral[3] : Color.Primary)};
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
	margin: 1rem 1.5rem 1rem 1.5rem;

	${MediaQuery.MaxWidth.mobileL}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		margin: 0 1.25rem;
		height: 6.5rem;
		max-height: 6.5rem;
	}
`;

export const FooterSaveButton = styled(Button.Default)`
	height: 3rem;
	margin-left: 1rem;
	min-width: 6.5rem;
	max-width: 7.125rem;
`;

export const EraserButton = styled.button<{ active?: boolean }>`
	${ButtonBase}
	padding: 0;
	width: 3rem;
	height: 3rem;

	${MediaQuery.MaxWidth.mobileL} {
		width: 2.5rem;
		height: 2.5rem;
	}
`;

export const EraserButtonIcon = styled(EraserIcon)<{ eraseMode: boolean }>`
	display: block;
	width: 100%;
	height: 100%;
	color: ${(props) => (props.eraseMode ? Color.Primary : Color.Neutral[3])};
`;

export const ButtonIcon = styled(PencilIcon)<{ colorScheme: string }>`
	color: ${(props) => (props.colorScheme === "light" ? Color.Neutral[3] : Color.Neutral[8])};
	width: 100%;
	height: 100%;
`;

export const PaletteHolder = styled.div`
	display: flex;
	gap: 0.5rem;
	flex-direction: flex-end;
`;

export const Palette = styled.button<{ color: string; colorScheme?: string }>`
	width: 3rem;
	height: 3rem;
	border-radius: 0.25rem;
	padding: 0.75rem;
	background-color: ${({ color }) => color};
	border: solid 1px ${({ color, colorScheme }) => (colorScheme === "light" ? "#979797" : color)};
	cursor: pointer;

	${MediaQuery.MaxWidth.mobileL} {
		width: 2.5rem;
		height: 2.5rem;
		margin-left: 0.25rem;
	}
`;
