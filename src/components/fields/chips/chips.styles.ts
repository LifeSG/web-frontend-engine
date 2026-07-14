import { Spacing } from "@lifesg/react-design-system/theme";
import styled from "styled-components";

export const ChipContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-8"]};

	&.chipsContainerShowTextarea {
		margin: ${Spacing["spacing-8"]} 0 ${Spacing["spacing-16"]};
	}

	&.chipsContainerHideTextarea {
		margin: ${Spacing["spacing-8"]} 0;
	}
`;
