import { Layout } from "@lifesg/react-design-system/layout";
import { Spacing } from "@lifesg/react-design-system/theme";
import { V2_MediaQuery } from "@lifesg/react-design-system/v2_media";
import styled from "styled-components";

export const GridWrapper = styled(Layout.Container)`
	gap: ${Spacing["spacing-32"]};
`;

export const V2GridWrapper = styled(Layout.Container)`
	gap: ${Spacing["spacing-32"]};
	display: grid;
	grid-template-columns: repeat(12, minmax(0, 1fr));

	${V2_MediaQuery.MaxWidth.tablet} {
		grid-template-columns: repeat(8, minmax(0, 1fr));
	}

	${V2_MediaQuery.MaxWidth.mobileL} {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
`;

export const Contained = styled.div`
	flex: 1;
`;
