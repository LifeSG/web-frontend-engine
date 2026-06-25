import { Colour, Font } from "@lifesg/react-design-system/theme";
import styled from "styled-components";
import { Sanitize } from "../../shared";

export const StyledSublabel = styled(Sanitize)`
	&.sub-label {
		display: block;
		${Font["body-md-regular"]};
	}
`;

export const StyledHint = styled(Sanitize)`
	&.label-hint {
		color: ${Colour.text};
		${Font["body-md-regular"]};
	}
`;
