import { ImageButton } from "@lifesg/react-design-system/image-button";
import { RadioButton } from "@lifesg/react-design-system/radio-button";
import { V2_Text } from "@lifesg/react-design-system/v2_text";
import { Toggle } from "@lifesg/react-design-system/toggle";
import styled from "styled-components";
import { TRadioToggleLayoutType } from "./types";

interface ILabelProps {
	disabled?: boolean | undefined;
}

interface IToggleWrapperProps {
	$layoutType?: TRadioToggleLayoutType;
}

export const Label = styled(V2_Text.BodySmall)<ILabelProps>`
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const StyledRadioButton = styled(RadioButton)`
	margin-right: 5px;
	flex-shrink: 0;
`;

export const StyledImageButton = styled(ImageButton)`
	flex: 1;
	img {
		min-width: 3.5rem;
	}
`;

export const RadioContainer = styled.div`
	display: flex;
	align-items: center;
	:not(:last-of-type) {
		margin-bottom: 1rem;
	}
`;

export const FlexImageWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
`;

export const FlexToggleWrapper = styled.div<IToggleWrapperProps>`
	display: flex;
	flex-direction: ${(props) => (props.$layoutType === "vertical" ? "column" : "row")};
	flex-wrap: wrap;
	gap: 1rem;
`;

export const StyledToggle = styled(Toggle)`
	[data-id="toggle-composite-children"] {
		margin: 0;
		padding: 0;
	}
`;
