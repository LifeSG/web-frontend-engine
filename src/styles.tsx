import { Color } from "react-lifesg-design-system";
import styled from "styled-components";

export const StyledForm = styled.form`
	* > ::placeholder {
		color: ${Color.Neutral[4]};
		opacity: 1;
	}
`;
