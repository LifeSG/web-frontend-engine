import { Border, Colour, Font, MediaQuery, Motion, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const searchWrapper = css`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: ${Spacing["spacing-32"]} ${Spacing["spacing-24"]} ${Spacing["spacing-16"]};

	${MediaQuery.MaxWidth.lg}, &[data-mobile-landscape="true"] {
		flex: unset;
		height: auto;
		padding: ${Spacing["spacing-24"]} ${Spacing["spacing-20"]} 0;
	}

	&[data-panel-mode="search"] {
		${MediaQuery.MaxWidth.lg}, &[data-mobile-landscape="true"] {
			height: 100%;
		}
	}
`;

export const searchBarContainer = css`
	position: relative;
	display: flex;
	gap: ${Spacing["spacing-8"]};
	padding-bottom: ${Spacing["spacing-8"]};
	align-items: center;
	justify-content: space-between;
	border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	clip-path: inset(0 0 -0.3rem 0);
	transition: box-shadow ${Motion["duration-250"]} ${Motion["ease-default"]};

	&:focus-within {
		border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour["border-focus"]};
	}

	${MediaQuery.MaxWidth.lg}, ${searchWrapper}[data-mobile-landscape="true"] & {
		margin: ${Spacing["spacing-12"]} 0 0;
	}
`;

export const searchBarContainerScrolled = css`
	box-shadow: 0 0.06rem 0.4rem rgba(0, 0, 0, 0.12);
`;

export const searchBarIconButton = css`
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

export const searchBarIconWrapper = css`
	> svg {
		width: 1rem;
		height: auto;
		color: ${Colour["icon-subtle"]};
	}
`;

export const searchBarInput = css`
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

export const searchBarModalCross = css`
	display: none;
	font-size: 1.5rem;
	color: ${Colour["icon-primary"]};

	${MediaQuery.MaxWidth.lg}, ${searchWrapper}[data-mobile-landscape="true"] & {
		display: block;
		margin: -${Spacing["spacing-8"]} 0 0 -${Spacing["spacing-8"]};
	}
`;

export const searchBarCross = css`
	font-size: 1.7rem;
	color: ${Colour["icon-subtle"]};
`;

export const resultWrapper = css`
	overflow-y: auto;
	flex: 1;
	border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour.border};

	${MediaQuery.MaxWidth.lg}, ${searchWrapper}[data-mobile-landscape="true"] & {
		display: block;
		border-bottom: 0;
	}

	&[data-panel-mode="map"] {
		${MediaQuery.MaxWidth.lg}, ${searchWrapper}[data-mobile-landscape="true"] & {
			display: none;
		}
	}
`;

export const resultTitle = css`
	border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	padding: ${Spacing["spacing-16"]} 0;
	font-weight: ${Font.Spec["weight-bold"]};
`;

export const noResultTitle = css`
	padding-top: ${Spacing["spacing-16"]};
	color: ${Colour["text-subtlest"]};
	word-break: break-all;
	overflow-y: scroll;
`;

export const resultItem = css`
	display: flex;
	align-items: center;
	gap: ${Spacing["spacing-16"]};
	padding: ${Spacing["spacing-16"]} ${Spacing["spacing-16"]} ${Spacing["spacing-16"]} 0;
	border-bottom: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	text-transform: uppercase;
	cursor: pointer;
	background-color: transparent;

	.keyword {
		font-weight: ${Font.Spec["weight-semibold"]};
	}
`;

export const resultItemActive = css`
	background-color: ${Colour["bg-selected"]};
`;

export const resultItemPin = css`
	width: 1rem;
	min-width: 1rem;
	color: ${Colour["icon-strongest"]};
`;

export const buttonWrapper = css`
	display: flex;
	justify-content: center;
	gap: ${Spacing["spacing-16"]};
	padding-top: ${Spacing["spacing-16"]};

	${MediaQuery.MaxWidth.lg}, ${searchWrapper}[data-mobile-landscape="true"] & {
		display: none;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: ${Spacing["spacing-24"]} ${Spacing["spacing-20"]} ${Spacing["spacing-32"]};
	}

	&[data-panel-mode="map"] {
		${MediaQuery.MaxWidth.lg}, ${searchWrapper}[data-mobile-landscape="true"] & {
			display: block;
		}
	}
`;

export const buttonItem = css`
	width: 9.5rem;
`;

export const buttonItemCancel = css`
	${MediaQuery.MaxWidth.lg}, ${searchWrapper}[data-mobile-landscape="true"] & {
		display: none;
	}
`;

export const buttonItemConfirm = css`
	${MediaQuery.MaxWidth.lg}, ${searchWrapper}[data-mobile-landscape="true"] & {
		width: 100%;
	}
`;

export const searchIcon = css`
	color: ${Colour["icon-subtle"]};
`;
