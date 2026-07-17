import { css } from "@linaria/core";

export const tokens = {
	container: {
		verticalMargin: "--fee-internal-divider-container-verticalMargin",
	},
};

export const container = css`
	${tokens.container.verticalMargin}: initial;
	margin: var(${tokens.container.verticalMargin}, 0);
`;
