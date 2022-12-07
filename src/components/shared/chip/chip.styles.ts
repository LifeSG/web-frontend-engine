import { Color } from "@lifesg/react-design-system/color";
import { Text } from "@lifesg/react-design-system/text";
import styled, { css } from "styled-components";
import { IChipButtonProps } from "./types";

// =============================================================================
// STYLING
// =============================================================================
export const ChipButton = styled.button<IChipButtonProps>`
	background-color: ${Color.Neutral[8]};
	border: 1px solid ${Color.Neutral[5]};
	border-radius: 1rem;
	display: inline-block;
	padding: 0.063rem 0.438rem;

	:hover {
		box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.2);
		cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	}

	:focus-visible {
		outline: none;
		box-shadow: 0 0 0 1px #024fa9;
	}

	${(props) => {
		if (props.isActive) {
			return css`
				background-color: ${Color.Neutral[4](props)};

				${ChipText} {
					color: ${Color.Neutral[7](props)};
				}
			`;
		}
	}}
`;

export const ChipText = styled(Text.XSmall)``;
