import styled from "styled-components";

export const tokens = {
	fluidIframe: {
		width: "--fds-internal-iframe-fluidIframe-width",
		height: "--fds-internal-iframe-fluidIframe-height",
	},
};

export const FluidIframe = styled.iframe`
	${tokens.fluidIframe.width}: initial;
	${tokens.fluidIframe.height}: initial;

	width: var(${tokens.fluidIframe.width}, 100%);
	height: var(${tokens.fluidIframe.height}, 100%);
	border: none;
`;
