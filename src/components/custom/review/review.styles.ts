import { MediaQuery, Spacing, UneditableSection } from "@lifesg/react-design-system";
import styled from "styled-components";

export const CustomUneditableSection = styled(UneditableSection)`
	padding: ${Spacing["spacing-32"]};
	${MediaQuery.MaxWidth.sm} {
		padding: ${Spacing["spacing-20"]};
	}
`;
