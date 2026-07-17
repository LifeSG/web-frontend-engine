import { Divider as DSDivider } from "@lifesg/react-design-system/divider";
import styled from "styled-components";

export const tokens = {
	container: {
		verticalMargin: "--fee-internal-divider-container-verticalMargin",
	},
};

export const Container = styled.div`
	${tokens.container.verticalMargin}: initial;
	margin: var(${tokens.container.verticalMargin}, 0);
`;

export const StyledDivider = styled(DSDivider)`
	margin: 0;
`;
