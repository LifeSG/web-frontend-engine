import { Alert } from "@lifesg/react-design-system/alert";
import { Color } from "@lifesg/react-design-system/color";
import { TextStyleHelper } from "@lifesg/react-design-system/text";
import styled from "styled-components";

export const ESignatureWrapper = styled.div`
	&:not(:last-child) {
		margin: 0 0 2rem;
	}
`;

export const ErrorWrapper = styled.div`
	margin: -1rem 0 2rem;
	color: ${Color.Validation.Red.Text};
	outline: none;
	${TextStyleHelper.getTextStyle("H6", "semibold")}
`;

export const TryAgain = styled.button`
	background: none;
	padding: 0;
	border: 0;
	${TextStyleHelper.getTextStyle("H6", "semibold")}
	margin-left: 0.5rem;
	color: ${Color.Primary};
	text-decoration: underline;
	cursor: pointer;
`;

export const RefreshAlert = styled(Alert)`
	margin-top: 0.5rem;
`;
