import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";
import styled from "styled-components";

export const Container = styled.div`
	padding: ${Spacing["spacing-32"]};
	${MediaQuery.MaxWidth.sm} {
		padding: ${Spacing["spacing-32"]} ${Spacing["spacing-20"]};
	}
`;
