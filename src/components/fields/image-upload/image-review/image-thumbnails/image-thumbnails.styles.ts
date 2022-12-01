import { Color } from "@lifesg/react-design-system/color";
import { IconButton } from "@lifesg/react-design-system/icon-button";
import styled, { keyframes } from "styled-components";

export const ThumbnailsWrapper = styled.div`
	display: flex;
	gap: 0.5rem;
	align-items: center;
	height: 100%;
	max-height: 5rem;
`;

export const ThumbnailItem = styled.div<{ src?: string; error?: boolean }>`
	position: relative;
	display: flex;
	cursor: pointer;
	width: 3rem;
	height: 3rem;
	border-radius: 2px;
	${({ src }) => `background-image: url(${src});`}
	background-color: ${({ error }) => error && "#eee"};
	background-position: center;
	background-size: cover;
`;

export const ThumbnailWarningIcon = styled.img`
	position: absolute;
	top: 12.5%;
	left: 12.5%;
	width: 75%;
	height: 75%;
`;

const dotMoveKeyframe = keyframes`
	0% {
		transform: scale(1);
	}
	11% {
		transform: scale(1.5) translate(0, -50%);
		opacity: 1;
	}
	27% {
		transform: scale(1);
		opacity: 0.25;
	}
`;

export const LoadingDot = styled.div`
	width: 0.3125rem;
	height: 0.3125rem;
	border-radius: 50%;
	animation: ${dotMoveKeyframe} 1.35s infinite linear;
	opacity: 0.25;
	background: ${Color.Neutral[2]};
	margin: 0.125rem;
	transform-origin: bottom;
`;

export const LoadingBox = styled.div`
	position: relative;
	display: flex;
	width: 3rem;
	height: 3rem;
	justify-content: center;
	align-items: center;
	border-radius: 2px;
	background-color: ${Color.Neutral[5]};

	${LoadingDot}:nth-child(1) {
		animation-delay: 0s;
	}
	${LoadingDot}:nth-child(2) {
		animation-delay: 0.1s;
	}
	${LoadingDot}:nth-child(3) {
		animation-delay: 0.17s;
	}
	${LoadingDot}:nth-child(4) {
		animation-delay: 0.25s;
	}
`;

export const BorderOverlay = styled.div<{ isSelected: boolean }>`
	border: ${(props) => (props.isSelected ? "solid  2px" : "none")};
	border-color: ${Color.Primary};
	width: inherit;
	height: inherit;
`;

export const HiddenFileSelect = styled.input`
	display: none;
`;

export const AddImageButton = styled(IconButton)`
	padding: 0;
	width: inherit;
	height: inherit;

	> img {
		width: inherit;
		height: inherit;
	}
`;
