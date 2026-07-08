import styled from "styled-components";
import { Border, Colour, Font, MediaQuery, Motion, Spacing } from "@lifesg/react-design-system/theme";
import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import { CrossIcon } from "@lifesg/react-icons/cross";
import { MagnifierIcon } from "@lifesg/react-icons/magnifier";
import { Typography } from "@lifesg/react-design-system/typography";
import { Button } from "@lifesg/react-design-system/button";

export const SearchWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: ${Spacing["spacing-32"]} ${Spacing["spacing-24"]} ${Spacing["spacing-16"]};

	${MediaQuery.MaxWidth.lg}, &[data-mobile-landscape="true"] {
		flex: unset;
		padding: ${Spacing["spacing-24"]} ${Spacing["spacing-20"]} 0;
	}

	&.searchWrapperPanelSearch {
		${MediaQuery.MaxWidth.lg}, &[data-mobile-landscape="true"] {
			height: 100%;
		}
	}

	&.searchWrapperPanelNotSearch {
		${MediaQuery.MaxWidth.lg}, &[data-mobile-landscape="true"] {
			height: auto;
		}
	}
`;

export const SearchBarContainer = styled.div`
	position: relative;
	display: flex;
	gap: ${Spacing["spacing-8"]};
	padding-bottom: ${Spacing["spacing-8"]};
	align-items: center;
	justify-content: space-between;
	border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	clip-path: inset(0 0 -0.3rem 0);
	transition: box-shadow ${Motion["duration-250"]} ${Motion["ease-default"]};

	&.searchBarContainerScrolled {
		box-shadow: 0 0.06rem 0.4rem rgba(0, 0, 0, 0.12);
	}

	&:focus-within {
		border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour["border-focus"]};
	}

	${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
		margin: ${Spacing["spacing-12"]} 0 0;
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

	&::placeholder,
	&::-webkit-input-placeholder {
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

	${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
		display: block;
		margin: -${Spacing["spacing-8"]} 0 0 -${Spacing["spacing-8"]};
	}
`;

export const SearchBarCross = styled(CrossIcon)`
	font-size: 1.7rem;
	color: ${Colour["icon-subtle"]};
`;

export const ResultWrapper = styled.div`
	overflow-y: auto;
	flex: 1;
	border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour.border};

	${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
		border-bottom: 0;
	}

	&.resultWrapperPanelMap {
		${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
			display: none;
		}
	}

	&.resultWrapperPanelNotMap {
		${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
			display: block;
		}
	}
`;

export const ResultTitle = styled(Typography.BodyMD)`
	border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	padding: ${Spacing["spacing-16"]} 0;
	font-weight: ${Font.Spec["weight-bold"]};
`;

export const NoResultTitle = styled(Typography.BodyMD)`
	padding-top: ${Spacing["spacing-16"]};
	color: ${Colour["text-subtlest"]};
	word-break: break-all;
	overflow-y: scroll;
`;

export const ResultItem = styled.div`
	display: flex;
	align-items: center;
	gap: ${Spacing["spacing-16"]};
	padding: ${Spacing["spacing-16"]} ${Spacing["spacing-16"]} ${Spacing["spacing-16"]} 0;
	border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	text-transform: uppercase;
	cursor: pointer;
	background-color: transparent;

	&.resultItemActive {
		background-color: ${Colour["bg-selected"]};
	}

	.keyword {
		font-weight: ${Font.Spec["weight-semibold"]};
	}
`;

export const ResultItemPin = styled(PinFillIcon)`
	width: 1rem;
	min-width: 1rem;
	color: ${Colour["icon-strongest"]};
`;

export const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	gap: ${Spacing["spacing-16"]};
	padding-top: ${Spacing["spacing-16"]};

	${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: ${Spacing["spacing-24"]} ${Spacing["spacing-20"]} ${Spacing["spacing-32"]};
	}

	&.buttonWrapperPanelMap {
		${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
			display: block;
		}
	}

	&.buttonWrapperPanelNotMap {
		${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
			display: none;
		}
	}
`;

export const ButtonItem = styled(Button)`
	width: 9.5rem;

	&.buttonItemCancel {
		${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
			display: none;
		}
	}

	&.buttonItemConfirm {
		${MediaQuery.MaxWidth.lg}, ${SearchWrapper}[data-mobile-landscape="true"] & {
			width: 100%;
		}
	}
`;

export const SearchIcon = styled(MagnifierIcon)`
	color: ${Colour["icon-subtle"]};
`;
