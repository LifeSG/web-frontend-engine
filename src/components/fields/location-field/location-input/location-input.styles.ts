import { Border, Colour, Font, Radius, Shadow, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const dummyLocationInput = css`
	border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border"]};
	border-radius: ${Radius["sm"]};
	background: ${Colour["bg"]};
	height: ${Spacing["spacing-48"]};
	padding: ${Spacing["spacing-0"]} ${Spacing["spacing-16"]};
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const dummyLocationInputReadOnly = css`
	border: ${Border["width-010"]} ${Border["solid"]} transparent;
	background: transparent;

	:focus-within {
		border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border-focus"]};
		box-shadow: none;
	}
`;

export const dummyLocationInputDisabled = css`
	background: ${Colour["bg-stronger"]};
	cursor: not-allowed;

	:focus-within {
		border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border"]};
		box-shadow: none;
	}
`;

export const dummyLocationInputError = css`
	border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border-error"]};

	:focus-within {
		border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border-error"]};
		box-shadow: ${Shadow["xs-error-strong"]};
	}
`;

export const locationInputText = css`
	flex: 1 1 auto;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	min-width: ${Spacing["spacing-0"]};
	overflow: hidden;
	cursor: text;
	text-align: left;
	${Font["body-baseline-regular"]};
	color: ${Colour["text"]};
`;

export const locationInputTextPlaceholder = css`
	color: ${Colour["text-subtler"]};
`;

export const locationInputTextDisabled = css`
	cursor: not-allowed;
`;

export const locationIconWrapper = css`
	display: flex;
	align-items: center;
	margin-left: ${Spacing["spacing-12"]};

	svg {
		height: ${Spacing["spacing-24"]};
		width: ${Spacing["spacing-24"]};
		#path {
			fill: ${Colour["text"]};
		}
	}
`;

export const locationIconWrapperDisabled = css`
	color: ${Colour.Primitive["neutral-70"]};

	svg {
		#path {
			fill: ${Colour.Primitive["neutral-70"]};
		}
	}
`;

export const locationIconWrapperReadOnly = css`
	margin-left: ${Spacing["spacing-4"]};
`;
