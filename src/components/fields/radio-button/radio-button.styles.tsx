import { ImageButton } from "@lifesg/react-design-system/image-button";
import { RadioButton } from "@lifesg/react-design-system/radio-button";
import { Toggle } from "@lifesg/react-design-system/toggle";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";
import { TRadioToggleLayoutType } from "./types";
import { Spacing } from "@lifesg/react-design-system/theme";

interface ILabelProps {
	disabled?: boolean | undefined;
}

interface IToggleWrapperProps {
	$layoutType?: TRadioToggleLayoutType;
}

export const Label = styled(Typography.BodyMD)<ILabelProps>`
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const StyledRadioButton = styled(RadioButton)`
	margin-right: ${Spacing["spacing-4"]};
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
		margin-bottom: ${Spacing["spacing-16"]};
	}
`;

export const FlexImageWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-16"]};
`;

export const FlexToggleWrapper = styled.div<IToggleWrapperProps>`
	display: flex;
	flex-direction: ${(props) => (props.$layoutType === "vertical" ? "column" : "row")};
	flex-wrap: wrap;
	gap: ${Spacing["spacing-16"]};
`;

export const StyledToggle = styled(Toggle)`
	[data-id="toggle-composite-children"] {
		margin: 0;
		padding: 0;
	}
`;
