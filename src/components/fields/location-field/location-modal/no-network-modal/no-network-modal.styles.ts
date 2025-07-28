import { Font, MediaQuery, Spacing } from "@lifesg/react-design-system/theme";
import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
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

	${MediaQuery.MaxWidth.sm} {
		width: 11.5rem;
	}
`;

export const ContentTitle = styled(Typography.BodyBL)`
	text-align: center;
	margin: ${Spacing["spacing-24"]} auto ${Spacing["spacing-8"]};

	${MediaQuery.MaxWidth.sm} {
		font-size: ${Font.Spec["body-size-sm"]};
	}
`;

export const ContentBody = styled(Typography.BodyBL)`
	text-align: center;
	width: 100%;

	${MediaQuery.MaxWidth.sm} {
		font-size: ${Font.Spec["body-size-sm"]};
		max-width: 14rem;
	}
`;

export const ButtonWrapper = styled(Button.Default)`
	margin-top: ${Spacing["spacing-40"]};
	width: 100%;
	max-width: 16.5rem;

	${MediaQuery.MaxWidth.sm} {
		max-width: 16.5rem;
	}
`;
