import { MediaQuery, Toggle } from "@lifesg/react-design-system";
import { Checkbox } from "@lifesg/react-design-system/checkbox";
import styled from "styled-components";
import { Text } from "@lifesg/react-design-system/text";
interface ILabelProps {
	disabled?: boolean | undefined;
}

export const Label = styled.label<ILabelProps>`
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

export const HeadingLabel = styled(Text.H6)`
	text-align: center;

	${MediaQuery.MaxWidth.mobileL} {
		text-align: left;
		align-self: center;
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
