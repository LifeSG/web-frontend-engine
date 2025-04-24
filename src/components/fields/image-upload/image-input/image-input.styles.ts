import { Border, Colour, Font, MediaQuery, Radius } from "@lifesg/react-design-system";
import { Alert } from "@lifesg/react-design-system/alert";
import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";

export interface SubtitleProps {
	$hasDescription?: boolean;
}

export const Wrapper = styled.div`
	border-radius: 0.25rem;
	${Border.Util["dashed-default"]({
		colour: Colour.border,
		thickness: Border["width-040"],
		radius: Radius.sm,
	})}
	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;

export const Subtitle = styled(Typography.BodyBL)<SubtitleProps>`
	margin-bottom: ${(props) => (props.$hasDescription ? "0.5rem" : "1rem")};
`;

export const Content = styled.div`
	${Font["body-md-regular"]};
	margin-bottom: 1.5rem;
	color: ${Colour["text-subtler"]};
`;

export const UploadWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-top: 2rem;
`;

export const AddButton = styled(Button.Small)`
	width: 100%;
	text-align: center;
	${MediaQuery.MinWidth.md} {
		width: 10rem;
		height: 2.5rem;
	}
`;

export const DropThemHereText = styled(Content)`
	margin-top: 0.5rem;
	display: none;
	${MediaQuery.MinWidth.xl} {
		display: block;
		width: 10rem;
		text-align: center;
	}
`;

export const AlertContainer = styled(Alert)`
	margin-top: 1rem;
	margin-bottom: 1rem;
`;
