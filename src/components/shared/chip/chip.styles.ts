import { Color, Text } from "@lifesg/react-design-system";
import styled, { css } from "styled-components";

interface IChipButtonProps {
	isActive?: boolean;
}

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
		cursor: pointer;
	}

	:focus-visible {
		outline: none;
		box-shadow: 0 0 0 1px #024fa9;
	}

	${(props) =>
		props.isActive &&
		css`
			background-color: ${Color.Neutral[4]};

			${ChipText} {
				color: ${Color.Neutral[7]};
			}
		`}
`;

export const ChipText = styled(Text.XSmall)``;
