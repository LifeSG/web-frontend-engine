import { Colour, Font, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const wrapper = css`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background-color: black;
	padding: ${Spacing["spacing-40"]};
	text-align: center;

	[data-mobile-landscape="true"] & {
		flex-direction: row;
	}
`;

export const errorIcon = css`
	width: 100%;
	max-width: 9rem;
	height: auto;
	margin-bottom: ${Spacing["spacing-32"]};

	[data-mobile-landscape="true"] & {
		margin: 0 ${Spacing["spacing-32"]} 0 0;
	}
`;

export const content = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${Spacing["spacing-8"]};
`;

export const bodyText = css`
	color: ${Colour["text-inverse"]};
	word-break: break-word;
`;

export const titleText = css`
	color: ${Colour["text-inverse"]};
	word-break: break-word;
`;

export const nameWrapper = css`
	display: inline-block;
	font-weight: ${Font.Spec["weight-bold"]};
`;

export const okButton = css`
	width: 100%;
	max-width: 16rem;
	margin-top: ${Spacing["spacing-32"]};

	[data-mobile-landscape="true"] & {
		margin-top: ${Spacing["spacing-8"]};
	}
`;
