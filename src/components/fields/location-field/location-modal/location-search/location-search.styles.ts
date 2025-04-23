import styled from "styled-components";
import { Breakpoint, Button, Colour, Font, MediaQuery, Typography } from "@lifesg/react-design-system";
import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import { CrossIcon } from "@lifesg/react-icons/cross";
import { TPanelInputMode } from "../../types";
import { MagnifierIcon } from "@lifesg/react-icons/magnifier";

interface ISinglePanelStyle {
	panelInputMode: TPanelInputMode;
}

export const SearchWrapper = styled.div<ISinglePanelStyle>`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 2rem 1.5rem 1rem;

	${MediaQuery.MaxWidth.lg}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		flex: unset;
		height: ${({ panelInputMode }) => (panelInputMode === "search" ? `100%` : `auto`)};
		padding: 1.5rem 1.25rem 0;
	}
`;

export const SearchBarContainer = styled.div<{ hasScrolled?: boolean }>`
	position: relative;
	display: flex;
	gap: 0.5rem;
	padding-bottom: 0.4rem;
	alight-items: center;
	justify-content: space-between;
	border-bottom: 1px solid ${Colour.border};
	clip-path: inset(0 0 -0.3rem 0);
	transition: box-shadow 0.3s linear;

	${({ hasScrolled }) => (hasScrolled ? `box-shadow: 0 0.06rem 0.4rem rgba(0,0,0,.12);` : "")}

	&:focus-within {
		border-bottom: 1px solid ${Colour["border-focus"]};
	}

	${MediaQuery.MaxWidth.lg}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		margin: 0.8rem 0 0;
	}
`;

export const SearchBarIconButton = styled.button`
	display: flex;
	width: fit-content;
	align-items: center;
	background: none;
	border: none;
	padding: 0;
	margin: 0;
	cursor: pointer;

	&:disabled {
		cursor: not-allowed;
	}
`;

export const SearchBarIconWrapper = styled.span`
	> svg {
		width: 1rem;
		height: auto;
		color: ${Colour["icon-subtle"]};
	}
`;

export const SearchBarInput = styled.input`
	border: none;
	width: 100%;
	margin: 0;
	padding: 0;
	font-size: 1rem;
	outline: none;

	::placeholder,
	::-webkit-input-placeholder {
		color: ${Colour["text-subtlest"]};
	}

	&:disabled {
		background-color: unset;
	}
`;

export const SearchBarModalCross = styled(CrossIcon)`
	display: none;
	font-size: 1.5rem;
	color: ${Colour["icon-primary"]};

	${MediaQuery.MaxWidth.lg}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		display: block;
		margin: -0.4rem 0 0 -0.4rem;
	}
`;

export const SearchBarCross = styled(CrossIcon)`
	font-size: 1.7rem;
	color: ${Colour["icon-subtle"]};
`;

export const ResultWrapper = styled.div<ISinglePanelStyle>`
	overflow-y: auto;
	flex: 1;
	border-bottom: solid 1px ${Colour.border};

	${MediaQuery.MaxWidth.lg}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		display: ${({ panelInputMode }) => (panelInputMode !== "map" ? `block` : `none`)};
		border-bottom: 0;
	}
`;

export const ResultTitle = styled(Typography.BodyMD)`
	border-bottom: 1px solid ${Colour.border};
	padding: 1rem 0;
	font-weight: ${Font.Spec["weight-bold"]};
`;

export const NoResultTitle = styled(Typography.BodyMD)`
	padding-top: 1rem;
	color: ${Colour["text-subtlest"]};
	word-break: break-all;
	overflow-y: scroll;
`;

export const ResultItem = styled.div<{ active?: boolean }>`
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1rem 1rem 0;
	border-bottom: 1px solid ${Colour.border};
	text-transform: uppercase;
	cursor: pointer;
	background-color: ${({ active }) => (active ? Colour["bg-selected"] : `transparent`)};

	.keyword {
		font-weight: ${Font.Spec["weight-semibold"]};
	}
`;

export const ResultItemPin = styled(PinFillIcon)`
	width: 1rem;
	min-width: 1rem;
	color: ${Colour["icon-strongest"]};
`;

export const ButtonWrapper = styled.div<ISinglePanelStyle>`
	display: flex;
	justify-content: center;
	gap: 1rem;
	padding-top: 1rem;

	${MediaQuery.MaxWidth.lg}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		display: ${({ panelInputMode }) => (panelInputMode === "map" ? `block` : `none`)};
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 1.5rem 1.25rem 1.93rem;
	}
`;

export const ButtonItem = styled(Button.Default)<{ buttonType: "cancel" | "confirm" }>`
	width: 9.5rem;

	${MediaQuery.MaxWidth.lg}, (orientation: landscape) and (max-height: ${Breakpoint["sm-max"]}px) {
		${({ buttonType }) => buttonType === "cancel" && `display: none`}
		${({ buttonType }) => buttonType === "confirm" && `width: 100%`}
	}
`;

export const SearchIcon = styled(MagnifierIcon)`
	color: ${Colour["icon-subtle"]};
`;
