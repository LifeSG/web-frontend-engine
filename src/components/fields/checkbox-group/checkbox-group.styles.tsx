import { Checkbox } from "@lifesg/react-design-system/checkbox";
import { Text } from "@lifesg/react-design-system/text";
import styled from "styled-components";
import { TCheckboxToggleLayoutType } from "./types";

interface ILabelProps {
	disabled?: boolean | undefined;
}

interface IToggleWrapperProps {
	layoutType: TCheckboxToggleLayoutType;
}

export const Label = styled(Text.BodySmall)<ILabelProps>`
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const StyledCheckbox = styled(Checkbox)`
	margin-right: 5px;
	flex-shrink: 0;
`;

export const CheckboxContainer = styled.div`
	display: flex;
	align-items: center;
	:not(:last-of-type) {
		margin-bottom: 1rem;
	}
`;

export const ToggleWrapper = styled.div<IToggleWrapperProps>`
	display: flex;
	flex-direction: ${(props) => (props.layoutType === "vertical" ? "column" : "row")};
	flex-wrap: wrap;
	gap: 1rem;
`;
