import { Spacing } from "@lifesg/react-design-system/theme";
import { V2_Layout } from "@lifesg/react-design-system/v2_layout";
import styled from "styled-components";

export const GridWrapper = styled(V2_Layout.Container)`
	gap: ${Spacing["spacing-32"]};
`;

export const Contained = styled.div`
	flex: 1;
`;
