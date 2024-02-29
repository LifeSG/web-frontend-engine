import { Checkbox } from "@lifesg/react-design-system/checkbox";
import { Text } from "@lifesg/react-design-system/text";
import styled from "styled-components";
import { checkboxToggleLayoutType } from "./types";

interface ILabelProps {
	disabled?: boolean | undefined;
}

interface ILayoutTypeProps {
	layoutType: checkboxToggleLayoutType;
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

export const ToggleWrapper = styled.div<ILayoutTypeProps>`
	display: flex;
	flex-direction: ${(props) => (props.layoutType === "horizontal" ? "row" : "column")};
	flex-wrap: wrap;
	gap: 1rem;
`;
