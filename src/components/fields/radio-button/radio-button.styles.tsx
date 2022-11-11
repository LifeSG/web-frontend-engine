import { RadioButton } from "@lifesg/react-design-system/radio-button";
import styled from "styled-components";

interface ILabelProps {
	disabled?: boolean;
}

export const Label = styled.label<ILabelProps>`
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

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
