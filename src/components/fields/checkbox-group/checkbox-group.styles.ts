import { Checkbox } from "@lifesg/react-design-system/checkbox";
import { Toggle } from "@lifesg/react-design-system/toggle";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";
import { Spacing } from "@lifesg/react-design-system/theme";

export const Label = styled(Typography.BodyMD)`
	cursor: pointer;

	&.labelDisabled {
		cursor: not-allowed;
	}
`;

export const StyledCheckbox = styled(Checkbox)`
	margin-right: ${Spacing["spacing-4"]};
	flex-shrink: 0;
`;

export const CheckboxContainer = styled.div`
	display: flex;
	align-items: center;
	&:not(:last-of-type) {
		margin-bottom: ${Spacing["spacing-16"]};
	}
`;

export const ToggleWrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-16"]};

	&.toggleWrapperVertical {
		flex-direction: column;
	}
`;

export const StyledToggle = styled(Toggle)`
	[data-id="toggle-composite-children"] {
		margin: 0;
		padding: 0;
	}
`;
