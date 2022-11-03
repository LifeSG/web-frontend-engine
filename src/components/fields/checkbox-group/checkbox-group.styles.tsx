import { Checkbox } from "@lifesg/react-design-system/checkbox";
import styled from "styled-components";

export const Label = styled.label`
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	cursor: pointer;

	&:last-child {
		margin-bottom: 0;
	}
`;

export const StyledCheckbox = styled(Checkbox)`
	margin-right: 10px;
`;
