import { TextStyleHelper } from "@lifesg/react-design-system/text";
import { DesignToken } from "@lifesg/react-design-system/design-token";
import { Color } from "@lifesg/react-design-system/color";
import styled, { css } from "styled-components";

interface InputWrapperStyleProps {
	disabled?: boolean | undefined;
	$error?: boolean | undefined;
	$readOnly?: boolean | undefined;
	$focused?: boolean | undefined;
}

const readOnlyFocusCss = css`
	border: 1px solid ${Color.Accent.Light[1]};
	box-shadow: none;
`;

const disabledFocusCss = css`
	border: 1px solid ${Color.Neutral[5]};
	box-shadow: none;
`;

const errorFocusCss = css`
	border: 1px solid ${Color.Validation.Red.Border};
	box-shadow: ${DesignToken.InputErrorBoxShadow};
`;

export const DummyLocationInput = styled.button<InputWrapperStyleProps>`
	border: 1px solid ${Color.Neutral[5]};
	background: ${Color.Neutral[8]};
	height: 3rem;
	border-radius: 4px;
	padding: 0 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	${(props) => {
		if (props.$readOnly) {
			return css`
				border: 1px solid transparent;
				background: transparent !important;

				:focus-within {
					${readOnlyFocusCss}
				}
				${props.$focused && readOnlyFocusCss}
			`;
		} else if (props.disabled) {
			return css`
				background: ${Color.Neutral[6]};
				cursor: not-allowed;

				:focus-within {
					${disabledFocusCss}
				}
				${props.$focused && disabledFocusCss}
			`;
		} else if (props.$error) {
			return css`
				border: 1px solid ${Color.Validation.Red.Border};

				:focus-within {
					${errorFocusCss}
				}
				${props.$focused && errorFocusCss}
			`;
		}
	}}
`;

export const LocationInputText = styled.span<{ $placeholder?: boolean; $disabled?: boolean }>`
	flex: 1 1 auto;
	min-width: 0;
	overflow: hidden;
	text-overflow: clip;
	white-space: nowrap;
	cursor: text;
	text-align: left;
	${TextStyleHelper.getTextStyle("Body", "regular")}
	color: ${Color.Neutral[1]};
	${(props) =>
		props.$placeholder &&
		css`
			color: ${Color.Neutral[3]};
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
		height: 1.5rem;
		width: 1.5rem;
		#path {
			fill: ${Color.Neutral[1]};
		}
	}
	${(props) => {
		if (props.$disabled) {
			return css`
				color: ${Color.Neutral[4](props)};
				svg {
					#path {
						fill: ${Color.Neutral[4](props)};
					}
				}
			`;
		}
		if (props.$readOnly) {
			return css`
				margin-left: ${props.$readOnly ? "0.25rem" : "0.75rem"};
			`;
		}
	}}

	${(props) => {
		return css`
			margin-left: ${props.$readOnly ? "0.25rem" : "0.75rem"};
		`;
	}}
`;
