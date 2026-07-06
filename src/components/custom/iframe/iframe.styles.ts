import { css } from "@linaria/core";

export const tokens = {
	fluidIframe: {
		width: "--fee-internal-iframe-fluidIframe-width",
		height: "--fee-internal-iframe-fluidIframe-height",
	},
};

export const fluidIframe = css`
	${tokens.fluidIframe.width}: initial;
	${tokens.fluidIframe.height}: initial;

	width: var(${tokens.fluidIframe.width}, 100%);
	height: var(${tokens.fluidIframe.height}, 100%);
	border: none;
`;
