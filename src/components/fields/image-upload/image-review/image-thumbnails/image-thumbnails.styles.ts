import { V2_ThemeSpec } from "@lifesg/react-design-system";
import { V2_Color } from "@lifesg/react-design-system/v2_color";
import { IconButton } from "@lifesg/react-design-system/icon-button";
import { ExclamationTriangleIcon } from "@lifesg/react-icons/exclamation-triangle";
import styled, { keyframes } from "styled-components";

export const ThumbnailsWrapper = styled.div`
	display: flex;
	gap: 0.5rem;
	align-items: center;
	height: 100%;
	max-height: 5rem;
`;

export const ThumbnailItem = styled.button<{ src?: string; error?: boolean }>`
	position: relative;
	cursor: pointer;
	width: 3rem;
	height: 3rem;
	padding: 0;
	border: none;
	border-radius: 2px;
	${({ src }) => `background-image: url(${src});`}
	background-color: ${({ error }) => error && "#eee"};
	background-position: center;
	background-size: cover;
`;

export const ThumbnailWarningIcon = styled(ExclamationTriangleIcon)`
	color: ${V2_Color.Neutral[4]};
	position: absolute;
	top: 5%;
	left: 5%;
	width: 90%;
	height: 90%;
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
	background: ${V2_Color.Neutral[2]};
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
	background-color: ${V2_Color.Neutral[5]};

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
	border-color: ${V2_Color.Primary};
	width: 100%;
	height: 100%;
`;

export const HiddenFileSelect = styled.input`
	display: none;
`;

export const AddImageButton = styled(IconButton)`
	padding: 0;
	width: 3rem;
	height: 3rem;
	background: #fff;
	${({ theme }) => {
		const borderColor = V2_Color.Primary({ theme });
		return `background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='${borderColor.replace(
			"#",
			"%23"
		)}FF' stroke-width='3' stroke-dasharray='5%2c1.55' stroke-dashoffset='5' stroke-linecap='butt'/%3e%3c/svg%3e");`;
	}}

	> svg {
		color: ${V2_Color.Primary};
		width: 2.2rem;
		height: 2.2rem;
		stroke: ${V2_Color.Primary};
		stroke-width: 1;
	}
`;
