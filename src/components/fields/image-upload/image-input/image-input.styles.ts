import { Colour, Font, MediaQuery, Spacing } from "@lifesg/react-design-system/theme";
import { Alert } from "@lifesg/react-design-system/alert";
import { Button } from "@lifesg/react-design-system/button";
import { DashedBorder } from "@lifesg/react-design-system/dashed-border";
import { Typography } from "@lifesg/react-design-system/typography";
import styled from "styled-components";

export const Wrapper = styled(DashedBorder)`
	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}
`;

export const Subtitle = styled(Typography.BodyBL)`
	margin-bottom: ${Spacing["spacing-16"]};

	&.subtitleHasDescription {
		margin-bottom: ${Spacing["spacing-8"]};
	}
`;

export const TooltipWrapper = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${Spacing["spacing-4"]};
	margin-top: ${Spacing["spacing-8"]};
	margin-bottom: ${Spacing["spacing-16"]};
	background: transparent;
	border: none;
	padding: 0;
	cursor: pointer;
	color: ${Colour["text-primary"]};

	&:hover {
		color: ${Colour["text-hover"]};
	}
`;

export const TooltipIcon = styled.span`
	width: 1rem;
	height: 1rem;
	color: inherit;

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const TooltipLabel = styled(Typography.BodyMD)`
	color: inherit;
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

export const AddButton = styled(Button)`
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
