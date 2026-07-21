import { css } from "@linaria/core";
import { Colour, Font, Spacing } from "@lifesg/react-design-system/theme";

export const eSignatureWrapper = css`
	&:not(:last-child) {
		margin: 0 0 ${Spacing["spacing-32"]};
	}
`;

export const errorWrapper = css`
	margin: calc(${Spacing["spacing-16"]} * -1) 0 ${Spacing["spacing-32"]};
	color: ${Colour["text-error"]};
	outline: none;
	${Font["body-sm-semibold"]}
	display: flex;
	gap: ${Spacing["spacing-4"]};
	align-items: center;
`;

export const tryAgain = css`
	background: none;
	padding: 0;
	border: 0;
	${Font["body-sm-semibold"]}
	margin-left: ${Spacing["spacing-8"]};
	color: ${Colour["text-primary"]};
	text-decoration: underline;
	cursor: pointer;
`;

export const refreshAlert = css`
	margin-top: ${Spacing["spacing-8"]};
`;
