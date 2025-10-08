import { Border, Colour, Font, MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { Alert } from "@lifesg/react-design-system/alert";
import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";

export interface SubtitleProps {
	$hasDescription?: boolean;
}

export const Wrapper = styled.div`
	border-radius: ${Radius.sm};
	${Border.Util["dashed-default"]({
		colour: Colour.border,
		thickness: Border["width-040"],
		radius: Radius.sm,
	})}
	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}
`;

export const Subtitle = styled(Typography.BodyBL)<SubtitleProps>`
	margin-bottom: ${(props) => (props.$hasDescription ? Spacing["spacing-8"] : Spacing["spacing-16"])};
`;

export const Content = styled.div`
	${Font["body-md-regular"]};
	margin-bottom: ${Spacing["spacing-24"]};
	color: ${Colour["text-subtler"]};
`;

export const UploadWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-top: ${Spacing["spacing-32"]};
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
	margin-top: ${Spacing["spacing-8"]};
	display: none;
	${MediaQuery.MinWidth.xl} {
		display: block;
		width: 10rem;
		text-align: center;
	}
`;

export const AlertContainer = styled(Alert)`
	margin-top: ${Spacing["spacing-16"]};
	margin-bottom: ${Spacing["spacing-16"]};
`;
