import { RadioButton } from "@lifesg/react-design-system/radio-button";
import styled from "styled-components";

export const Label = styled.label``;

export const StyledRadioButton = styled(RadioButton)`
	margin-right: 5px;
`;

export const RadioContainer = styled.div`
	display: flex;
	align-items: center;
	:not(:last-of-type) {
		margin-bottom: 1rem;
	}
`;
