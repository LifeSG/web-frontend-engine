import { RadioButton } from "@lifesg/react-design-system/radio-button";
import { Toggle } from "@lifesg/react-design-system";
import styled from "styled-components";

interface ILabelProps {
	disabled?: boolean | undefined;
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

export const ToggleWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: left;
`;

export const StyledToggle = styled(Toggle)`
	margin-bottom: 1rem;
	margin-right: 1rem;
`;
