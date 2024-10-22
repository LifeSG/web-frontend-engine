import styled from "styled-components";
import { Button, Color, MediaQuery, MediaWidths, Text } from "@lifesg/react-design-system";
import { PinFillIcon } from "@lifesg/react-icons";
import { CrossIcon } from "@lifesg/react-icons/cross";
import { TPanelInputMode } from "../../types";

interface ISinglePanelStyle {
	panelInputMode: TPanelInputMode;
}

export const SearchWrapper = styled.div<ISinglePanelStyle>`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 2rem 1.5rem 1rem;

	${MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
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
	border-bottom: 1px solid ${Color.Neutral[5]};
	clip-path: inset(0 0 -0.3rem 0);
	transition: box-shadow 0.3s linear;

	${({ hasScrolled }) => (hasScrolled ? `box-shadow: 0 0.06rem 0.4rem rgba(0,0,0,.12);` : "")}

	&:focus-within {
		border-bottom: 1px solid ${Color.Accent.Light[1]};
	}

	${MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
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
		color: ${Color.Neutral[4]};
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
		color: ${Color.Neutral[4]};
	}

	&:disabled {
		background-color: unset;
	}
`;

export const SearchBarModalCross = styled(CrossIcon)`
	display: none;
	font-size: 1.5rem;
	color: ${Color.Primary};

	${MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		display: block;
		margin: -0.4rem 0 0 -0.4rem;
	}
`;

export const SearchBarCross = styled(CrossIcon)`
	font-size: 1.7rem;
	color: ${Color.Neutral[4]};
`;

export const ResultWrapper = styled.div<ISinglePanelStyle>`
	overflow-y: auto;
	flex: 1;
	border-bottom: solid 1px ${Color.Neutral[5]};

	${MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		display: ${({ panelInputMode }) => (panelInputMode !== "map" ? `block` : `none`)};
		border-bottom: 0;
	}
`;

export const ResultTitle = styled(Text.H5)`
	border-bottom: 1px solid ${Color.Neutral[5]};
	padding: 1rem 0;
`;

export const NoResultTitle = styled(Text.BodySmall)`
	padding-top: 1rem;
	color: ${Color.Neutral[4]};
	word-break: break-all;
	overflow-y: scroll;
`;

export const ResultItem = styled.div<{ active?: boolean }>`
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1rem 1rem 0;
	border-bottom: 1px solid ${Color.Neutral[5]};
	text-transform: uppercase;
	cursor: pointer;
	background-color: ${({ active }) => (active ? Color.Accent.Light[5] : `transparent`)};

	.keyword {
		font-family: "Open Sans Semibold";
	}
`;

export const ResultItemPin = styled(PinFillIcon)`
	width: 1rem;
	min-width: 1rem;
	color: ${Color.Neutral[1]};
`;

export const ButtonWrapper = styled.div<ISinglePanelStyle>`
	display: flex;
	justify-content: center;
	gap: 1rem;
	padding-top: 1rem;

	${MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
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

	${MediaQuery.MaxWidth.tablet}, (orientation: landscape) and (max-height: ${MediaWidths.mobileL}px) {
		${({ buttonType }) => buttonType === "cancel" && `display: none`}
		${({ buttonType }) => buttonType === "confirm" && `width: 100%`}
	}
`;
