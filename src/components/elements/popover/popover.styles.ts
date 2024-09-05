import { Color } from "@lifesg/react-design-system/color";
import styled from "styled-components";

// =============================================================================
// STYLE INTERFACE
// =============================================================================

interface StyledIconProps {
	$standalone: boolean;
}

// =============================================================================
// STYLING
// =============================================================================

export const StyledText = styled.span`
	color: ${Color.Primary};
	font-weight: 600;
`;

export const StyledIcon = styled.span<StyledIconProps>`
	height: 1lh; // align vertically
	width: 1em; // scale icon with font size
	vertical-align: top;

	${(props) => !props.$standalone && "margin-left: 0.25rem;"}
`;
