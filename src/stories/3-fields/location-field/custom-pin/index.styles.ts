import { Colour, Font, Radius, Shadow, Spacing } from "@lifesg/react-design-system/theme";
import styled from "styled-components";

export const PinBadgeContainer = styled.div`
	position: relative;
	display: inline-flex;
	align-items: center;
	gap: ${Spacing["spacing-4"]};
	padding: ${Spacing["spacing-4"]};
	background: ${Colour["bg-primary"]};
	border-radius: ${Radius.full};
	box-shadow: ${Shadow["sm-subtle"]};
	color: ${Colour["text-inverse"]};

	&::after {
		content: "";
		position: absolute;
		top: calc(100% - 1px);
		left: 50%;
		transform: translateX(-50%);
		border-width: 8px;
		border-style: solid;
		border-color: ${Colour["bg-primary"]} transparent transparent transparent;
	}
`;

export const PinIconWrapper = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2px;
`;

export const PinIconImage = styled.img`
	width: ${Spacing["spacing-24"]};
	height: ${Spacing["spacing-24"]};
	object-fit: contain;
	flex-shrink: 0;
`;

export const PinCount = styled.span`
	${Font["body-sm-semibold"]};
	font-weight: ${Font.Spec["weight-semibold"]};
`;

export const HomeBadgeImage = styled.img`
	display: block;
	width: ${Spacing["spacing-40"]};
	height: ${Spacing["spacing-40"]};
	object-fit: contain;
`;
