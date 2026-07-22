import { Checkbox } from "@lifesg/react-design-system/checkbox";
import { Toggle } from "@lifesg/react-design-system/toggle";
import { Typography } from "@lifesg/react-design-system/typography";
import styled, { css } from "styled-components";
import { TCheckboxToggleLayoutType } from "./types";
import { Colour, Spacing } from "@lifesg/react-design-system/theme";

interface ILabelProps {
	disabled?: boolean | undefined;
}

interface IToggleWrapperProps {
	$layoutType?: TCheckboxToggleLayoutType;
	$hasError?: boolean | undefined;
}

interface IStyledToggleProps {
	$hasError?: boolean | undefined;
}

export const Label = styled(Typography.BodyMD)<ILabelProps>`
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
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

export const ToggleWrapper = styled.div<IToggleWrapperProps>`
	display: flex;
	flex-direction: ${(props) => (props.$layoutType === "vertical" ? "column" : "row")};
	flex-wrap: wrap;
	gap: ${Spacing["spacing-16"]};

	${(props) =>
		props.$hasError &&
		css`
			/* No item selected — all items get error border */
			&:not(:has(input:checked)) > * {
				border-color: ${Colour["border-error"](props)};
			}

			/* An item is selected — unselected items revert to normal border */
			&:has(input:checked) > *:not(:has(input:checked)) {
				border-color: ${Colour.border(props)};
			}
		`}
`;

export const StyledToggle = styled(Toggle)<IStyledToggleProps>`
	[data-id="toggle-composite-children"] {
		margin: 0;
		padding: 0;
	}

	${(props) =>
		props.$hasError &&
		css`
			&:has(input:checked) {
				background: ${Colour["bg-error"](props)};
				border-color: ${Colour["border-error"](props)};

				label,
				span {
					color: ${Colour["text-error"](props)};
				}

				svg {
					color: ${Colour["icon-error"](props)};
				}
			}
		`}
`;
