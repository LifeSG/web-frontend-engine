import { Border, Colour } from "@lifesg/react-design-system/theme";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";

// =============================================================================
// STYLING
// =============================================================================
export const ChipText = styled(Typography.BodyXS)``;

export const ChipButton = styled.button`
	background-color: ${Colour.bg};
	border: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	border-radius: 1rem;
	display: inline-block;
	padding: 0.063rem 0.438rem;
	overflow-wrap: anywhere;

	&:hover {
		box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	&.chipButtonDisabled:hover {
		cursor: not-allowed;
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 1px #024fa9;
	}

	&.chipButtonActive {
		background-color: ${Colour["bg-inverse-subtlest"]};

		${ChipText} {
			color: ${Colour["text-inverse"]};
		}
	}
`;
