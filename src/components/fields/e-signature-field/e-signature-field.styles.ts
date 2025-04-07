import { Colour, V2_TextStyleHelper } from "@lifesg/react-design-system";
import { Alert } from "@lifesg/react-design-system/alert";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";

export const ESignatureWrapper = styled.div`
	&:not(:last-child) {
		margin: 0 0 2rem;
	}
`;

export const ErrorWrapper = styled(Typography.BodySM)`
	margin: -1rem 0 2rem;
	color: ${Colour["text-error"]};
	outline: none;
`;

export const TryAgain = styled.button`
	background: none;
	padding: 0;
	border: 0;
	${V2_TextStyleHelper.getTextStyle("H6", "semibold")}
	margin-left: 0.5rem;
	color: ${Colour["text-primary"]};
	text-decoration: underline;
	cursor: pointer;
`;

export const RefreshAlert = styled(Alert)`
	margin-top: 0.5rem;
`;
