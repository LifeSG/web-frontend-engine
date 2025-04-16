import { Border, Colour, Font } from "@lifesg/react-design-system/theme";
import { Typography } from "@lifesg/react-design-system/typography";
import styled, { css } from "styled-components";
import { IChipButtonProps } from "./types";

// =============================================================================
// STYLING
// =============================================================================
export const ChipButton = styled.button<IChipButtonProps>`
	background-color: ${Colour.bg};
	border: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	border-radius: 1rem;
	display: inline-block;
	padding: 0.063rem 0.438rem;
	overflow-wrap: anywhere;

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
				background-color: ${Colour["bg-inverse-subtlest"](props)};

				${ChipText} {
					color: ${Colour["text-inverse"](props)};
				}
			`;
		}
	}}
`;

export const ChipText = styled(Typography.BodyXS)``;
