import { Alert } from "@lifesg/react-design-system/alert";
import { V2_Color } from "@lifesg/react-design-system/v2_color";
import { V2_Text, V2_TextStyleHelper } from "@lifesg/react-design-system/v2_text";
import styled from "styled-components";

export const ESignatureWrapper = styled.div`
	&:not(:last-child) {
		margin: 0 0 2rem;
	}
`;

export const ErrorWrapper = styled(V2_Text.H6)`
	margin: -1rem 0 2rem;
	color: ${V2_Color.Validation.Red.Text};
	outline: none;
`;

export const TryAgain = styled.button`
	background: none;
	padding: 0;
	border: 0;
	${V2_TextStyleHelper.getTextStyle("H6", "semibold")}
	margin-left: 0.5rem;
	color: ${V2_Color.Primary};
	text-decoration: underline;
	cursor: pointer;
`;

export const RefreshAlert = styled(Alert)`
	margin-top: 0.5rem;
`;
