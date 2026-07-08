import { Border, Colour, Font, Radius, Shadow, Spacing } from "@lifesg/react-design-system/theme";
import styled, { css } from "styled-components";

const readOnlyFocusCss = css`
	border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border-focus"]};
	box-shadow: none;
`;

const disabledFocusCss = css`
	border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border"]};
	box-shadow: none;
`;

const errorFocusCss = css`
	border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border-error"]};
	box-shadow: ${Shadow["xs-error-strong"]};
`;

export const DummyLocationInput = styled.button`
	border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border"]};
	border-radius: ${Radius["sm"]};
	background: ${Colour["bg"]};
	height: ${Spacing["spacing-48"]};
	padding: ${Spacing["spacing-0"]} ${Spacing["spacing-16"]};
	display: flex;
	align-items: center;
	justify-content: space-between;

	&.dummyLocationInputReadOnly {
		border: ${Border["width-010"]} ${Border["solid"]} transparent;
		background: transparent !important;

		:focus-within {
			${readOnlyFocusCss}
		}

		&.dummyLocationInputFocused {
			${readOnlyFocusCss}
		}
	}

	&.dummyLocationInputDisabled {
		background: ${Colour["bg-stronger"]};
		cursor: not-allowed;

		:focus-within {
			${disabledFocusCss}
		}

		&.dummyLocationInputFocused {
			${disabledFocusCss}
		}
	}

	&.dummyLocationInputError {
		border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border-error"]};

		:focus-within {
			${errorFocusCss}
		}

		&.dummyLocationInputFocused {
			${errorFocusCss}
		}
	}
`;

export const LocationInputText = styled.span`
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

	&.locationInputTextPlaceholder {
		color: ${Colour["text-subtler"]};
	}

	&.locationInputTextDisabled {
		cursor: not-allowed;
	}
`;

export const LocationIconWrapper = styled.div`
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

	&.locationIconWrapperDisabled {
		color: ${Colour.Primitive["neutral-70"]};

		svg {
			#path {
				fill: ${Colour.Primitive["neutral-70"]};
			}
		}
	}

	&.locationIconWrapperReadOnly {
		margin-left: ${Spacing["spacing-4"]};
	}
`;
