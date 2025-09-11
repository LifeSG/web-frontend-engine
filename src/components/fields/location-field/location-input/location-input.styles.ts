import { Border, Colour, Font, Radius, Shadow, Spacing } from "@lifesg/react-design-system/theme";
import styled, { css } from "styled-components";

interface InputWrapperStyleProps {
	disabled?: boolean | undefined;
	$error?: boolean | undefined;
	$readOnly?: boolean | undefined;
	$focused?: boolean | undefined;
}

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

export const DummyLocationInput = styled.button<InputWrapperStyleProps>`
	border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border"]};
	border-radius: ${Radius["sm"]};
	background: ${Colour["bg"]};
	height: ${Spacing["spacing-48"]};
	padding: ${Spacing["spacing-0"]} ${Spacing["spacing-16"]};
	display: flex;
	align-items: center;
	justify-content: space-between;
	${(props) => {
		if (props.$readOnly) {
			return css`
				border: ${Border["width-010"]} ${Border["solid"]} transparent;
				background: transparent !important;
				:focus-within {
					${readOnlyFocusCss}
				}
				${props.$focused && readOnlyFocusCss}
			`;
		} else if (props.disabled) {
			return css`
				background: ${Colour["bg-stronger"]};
				cursor: not-allowed;
				:focus-within {
					${disabledFocusCss}
				}
				${props.$focused && disabledFocusCss}
			`;
		} else if (props.$error) {
			return css`
				border: ${Border["width-010"]} ${Border["solid"]} ${Colour["border-error"]};
				:focus-within {
					${errorFocusCss}
				}
				${props.$focused && errorFocusCss};
			`;
		}
	}}
`;

export const LocationInputText = styled.span<{ $placeholder?: boolean; $disabled?: boolean }>`
	flex: 1 1 auto;
	min-width: ${Spacing["spacing-0"]};
	overflow: hidden;
	text-overflow: clip;
	white-space: nowrap;
	cursor: text;
	text-align: left;
	${Font["body-baseline-regular"]};
	color: ${Colour["text"]};
	${(props) =>
		props.$placeholder &&
		css`
			color: ${Colour["text-subtler"]};
		`}
	${(props) =>
		props.$disabled &&
		css`
			cursor: not-allowed;
		`}
`;

export const LocationIconWrapper = styled.div<{ $disabled?: boolean; $readOnly?: boolean }>`
	display: flex;
	align-items: center;
	svg {
		height: ${Spacing["spacing-24"]};
		width: ${Spacing["spacing-24"]};
		#path {
			fill: ${Colour["text"]};
		}
	}
	${(props) => {
		if (props.$disabled) {
			return css`
				color: ${Colour.Primitive["neutral-70"](props)};
				svg {
					#path {
						fill: ${Colour.Primitive["neutral-70"](props)};
					}
				}
			`;
		}
		if (props.$readOnly) {
			return css`
				margin-left: ${props.$readOnly ? Spacing["spacing-4"] : Spacing["spacing-12"]};
			`;
		}
	}}
	${(props) => {
		return css`
			margin-left: ${props.$readOnly ? Spacing["spacing-4"] : Spacing["spacing-12"]};
		`;
	}}
`;
