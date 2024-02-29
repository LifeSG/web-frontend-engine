import { ImageButton } from "@lifesg/react-design-system";
import { RadioButton } from "@lifesg/react-design-system/radio-button";
import { Text } from "@lifesg/react-design-system/text";
import styled from "styled-components";
import { radioToggleLayoutType } from "./types";

interface ILabelProps {
	disabled?: boolean | undefined;
}

interface ILayoutTypeProps {
	layoutType?: radioToggleLayoutType;
}

export const Label = styled(Text.BodySmall)<ILabelProps>`
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

export const FlexToggleWrapper = styled.div<ILayoutTypeProps>`
	display: flex;
	flex-direction: ${(props) => (props.layoutType === "horizontal" ? "row" : "column")};
	flex-wrap: wrap;
	gap: 1rem;
`;
