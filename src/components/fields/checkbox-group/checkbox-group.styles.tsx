import { Checkbox } from "@lifesg/react-design-system/checkbox";
import { Text } from "@lifesg/react-design-system/text";
import styled from "styled-components";
interface ILabelProps {
	disabled?: boolean | undefined;
}

export const Label = styled(Text.BodySmall)<ILabelProps>`
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const StyledCheckbox = styled(Checkbox)`
	margin-right: 5px;
`;

export const CheckboxContainer = styled.div`
	display: flex;
	align-items: center;
	:not(:last-of-type) {
		margin-bottom: 1rem;
	}
`;

export const ToggleWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
`;
