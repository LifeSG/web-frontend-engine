import { Alert } from "@lifesg/react-design-system/alert";
import { Button } from "@lifesg/react-design-system/button";
import { Color } from "@lifesg/react-design-system/color";
import { MediaQuery } from "@lifesg/react-design-system/media";
import { Text } from "@lifesg/react-design-system/text";
import styled from "styled-components";

export const Wrapper = styled.div`
	margin: 1.25rem 0;
	border-radius: 0.25rem;
	${(props) => {
		const color = encodeURIComponent(Color.Neutral[5](props));
		/* Generated background-image for the dashed border from https://kovart.github.io/dashed-border-generator/  */
		return `background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='${color}' stroke-width='4' stroke-dasharray='8%2c 8' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e");`;
	}}

	> :not(:last-child) {
		margin-bottom: 2.5rem;
	}
`;

export const Subtitle = styled(Text.Body)`
	margin-bottom: 0.55rem;
`;

export const Content = styled(Text.BodySmall)`
	color: ${Color.Neutral[3]};
`;

export const UploadWrapper = styled.div`
	margin-top: 2rem;
`;

export const AddButton = styled(Button.Small)`
	width: 100%;
	text-align: center;
	${MediaQuery.MinWidth.mobileL} {
		width: 10rem;
		height: 2.5rem;
	} ;
`;

export const DropThemHereText = styled(Content)`
	margin-top: 0.5rem;
	display: none;
	${MediaQuery.MinWidth.tablet} {
		display: block;
		width: 10rem;
		text-align: center;
	}
`;

export const AlertContainer = styled(Alert)`
	margin-top: 1rem;
	margin-bottom: 1rem;
`;
