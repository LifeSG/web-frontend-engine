import { Button } from "@lifesg/react-design-system/button";
import { V2_MediaQuery } from "@lifesg/react-design-system/v2_media";
import { V2_Text } from "@lifesg/react-design-system/v2_text";
import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* to take full width of modal */
	flex: 1;
`;

export const Image = styled.img`
	width: 12.5625rem;

	${V2_MediaQuery.MaxWidth.mobileL} {
		width: 11.5rem;
	}
`;

export const ContentTitle = styled(V2_Text.Body)`
	text-align: center;
	margin: 1.5rem auto 0.5rem;

	${V2_MediaQuery.MaxWidth.mobileL} {
		font-size: 0.875rem !important;
	}
`;

export const ContentBody = styled(V2_Text.Body)`
	text-align: center;
	width: 100%;

	${V2_MediaQuery.MaxWidth.mobileL} {
		font-size: 0.875rem !important;
		max-width: 14rem;
	}
`;

export const ButtonWrapper = styled(Button.Default)`
	margin-top: 2.5rem;
	width: 100%;
	max-width: 16.5rem;

	${V2_MediaQuery.MaxWidth.mobileL} {
		max-width: 16.5rem;
	}
`;
