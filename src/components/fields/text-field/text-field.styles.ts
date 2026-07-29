import { css } from "@linaria/core";

export const tokens = {
	customIcon: {
		color: "--fee-internal-textField-customIcon-color",
	},
};

export const customIcon = css`
	${tokens.customIcon.color}: initial;
	color: var(${tokens.customIcon.color}, inherit);
`;
