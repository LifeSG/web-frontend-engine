import { Alert } from "@lifesg/react-design-system/alert";
import { Colour, Font, Spacing } from "@lifesg/react-design-system/theme";
import styled from "styled-components";

export const ESignatureWrapper = styled.div`
	&:not(:last-child) {
		margin: 0 0 ${Spacing["spacing-32"]};
	}
`;

export const ErrorWrapper = styled.div`
	margin: -${Spacing["spacing-16"]} 0 ${Spacing["spacing-32"]};
	color: ${Colour["text-error"]};
	outline: none;
	${Font["body-sm-semibold"]}
`;

export const TryAgain = styled.button`
	background: none;
	padding: 0;
	border: 0;
	${Font["body-sm-semibold"]}
	margin-left: ${Spacing["spacing-8"]};
	color: ${Colour["text-primary"]};
	text-decoration: underline;
	cursor: pointer;
`;

export const RefreshAlert = styled(Alert)`
	margin-top: ${Spacing["spacing-8"]};
`;
