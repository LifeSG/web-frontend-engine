import { Button } from "@lifesg/react-design-system/button";
import { MediaQuery } from "@lifesg/react-design-system/media";
import { Text } from "@lifesg/react-design-system/text";
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

	${MediaQuery.MaxWidth.mobileL} {
		width: 11.5rem;
	}
`;

export const ContentTitle = styled(Text.Body)`
	text-align: center;
	margin: 1.5rem auto 0.5rem;

	${MediaQuery.MaxWidth.mobileL} {
		font-size: 0.875rem !important;
	}
`;

export const ContentBody = styled(Text.Body)`
	text-align: center;
	width: 100%;

	${MediaQuery.MaxWidth.mobileL} {
		font-size: 0.875rem !important;
		max-width: 14rem;
	}
`;

export const ButtonWrapper = styled(Button.Default)`
	margin-top: 2.5rem;
	width: 100%;
	max-width: 16.5rem;

	${MediaQuery.MaxWidth.mobileL} {
		max-width: 16.5rem;
	}
`;
