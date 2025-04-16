import { Border, Colour, Radius, V2_ThemeSpec } from "@lifesg/react-design-system";
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
	color: ${Colour["icon-subtle"]};
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
	background: ${Colour["bg-inverse-subtle"]};
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
	background-color: ${Colour["bg-strongest"]};

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
	border-color: ${Colour["border-primary"]};
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
	${Border.Util["dashed-default"]({
		colour: Colour.border,
		thickness: Border["width-040"],
		radius: Radius.sm,
	})}

	> svg {
		color: ${Colour["icon-primary"]};
		width: 2.2rem;
		height: 2.2rem;
		stroke: ${Colour["icon-primary"]};
		stroke-width: 1;
	}
`;
