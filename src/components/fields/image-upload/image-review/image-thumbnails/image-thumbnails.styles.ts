import { Border, Colour, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const tokens = {
	thumbnailItem: {
		backgroundImage: "--fee-internal-imageThumbnails-thumbnailItem-backgroundImage",
	},
};

export const thumbnailsWrapper = css`
	display: flex;
	gap: ${Spacing["spacing-8"]};
	align-items: center;
	height: 100%;
	max-height: 5rem;
`;

export const thumbnailItem = css`
	position: relative;
	cursor: pointer;
	width: 3rem;
	height: 3rem;
	padding: 0;
	border: none;
	border-radius: ${Radius.xs};
	${tokens.thumbnailItem.backgroundImage}: initial;
	background-image: var(${tokens.thumbnailItem.backgroundImage});
	background-position: center;
	background-size: cover;
`;

export const thumbnailItemError = css`
	background-color: #eee;
`;

export const thumbnailWarningIcon = css`
	color: ${Colour["icon-subtle"]};
	position: absolute;
	top: 5%;
	left: 5%;
	width: 90%;
	height: 90%;
`;

export const loadingDot = css`
	width: 0.3125rem;
	height: 0.3125rem;
	border-radius: 50%;
	opacity: 0.25;
	background: ${Colour["bg-inverse-subtle"]};
	margin: 0.125rem;
	transform-origin: bottom;
	animation: dot-move-animation 1.35s infinite linear;

	@keyframes dot-move-animation {
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
	}
`;

export const loadingBox = css`
	position: relative;
	display: flex;
	width: 3rem;
	height: 3rem;
	justify-content: center;
	align-items: center;
	border-radius: ${Radius.xs};
	background-color: ${Colour["bg-strongest"]};

	.${loadingDot}:nth-child(1) {
		animation-delay: 0s;
	}
	.${loadingDot}:nth-child(2) {
		animation-delay: 0.1s;
	}
	.${loadingDot}:nth-child(3) {
		animation-delay: 0.17s;
	}
	.${loadingDot}:nth-child(4) {
		animation-delay: 0.25s;
	}
`;

export const borderOverlay = css`
	border: none;
	border-color: ${Colour["border-primary"]};
	width: 100%;
	height: 100%;
`;

export const borderOverlayIsSelected = css`
	border: ${Border.solid} ${Border["width-020"]};
	border-color: ${Colour["border-primary"]};
`;

export const hiddenFileSelect = css`
	display: none;
`;

export const addImageButtonWrapper = css`
	width: 3rem;
	height: 3rem;
`;

export const addImageButton = css`
	padding: 0;
	width: 100%;
	height: 100%;
	min-width: 0;
	font-size: 2.2rem;
	background: #fff;
	border: none;

	> svg {
		color: ${Colour["icon-primary"]};
		stroke: ${Colour["icon-primary"]};
		stroke-width: 1;
	}
`;
