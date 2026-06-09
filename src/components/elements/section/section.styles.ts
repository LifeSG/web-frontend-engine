import { Layout } from "@lifesg/react-design-system/layout";
import { Spacing } from "@lifesg/react-design-system/theme";
import styled from "styled-components";

export const GridWrapper = styled(Layout.Container)`
	gap: ${Spacing["spacing-32"]};
`;

export const Contained = styled.div`
	flex: 1;
`;
