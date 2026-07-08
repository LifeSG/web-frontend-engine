import { Colour, Font, MediaQuery, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const wrapper = css`
	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}
`;

export const subtitle = css`
	margin-bottom: ${Spacing["spacing-16"]};
`;

export const subtitleHasDescription = css`
	margin-bottom: ${Spacing["spacing-8"]};
`;

export const tooltipWrapper = css`
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

export const tooltipIcon = css`
	width: 1rem;
	height: 1rem;
	color: inherit;

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const tooltipLabel = css`
	color: inherit;
`;

export const content = css`
	${Font["body-md-regular"]};
	margin-bottom: ${Spacing["spacing-24"]};
	color: ${Colour["text-subtler"]};
`;

export const uploadWrapper = css`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	margin-top: ${Spacing["spacing-32"]};
`;

export const addButton = css`
	width: 100%;
	text-align: center;
	${MediaQuery.MinWidth.md} {
		width: 10rem;
		height: 2.5rem;
	}
`;

export const dropThemHereText = css`
	margin-top: ${Spacing["spacing-8"]};
	display: none;
	${MediaQuery.MinWidth.xl} {
		display: block;
		width: 10rem;
		text-align: center;
	}
`;

export const alertContainer = css`
	margin-top: ${Spacing["spacing-16"]};
	margin-bottom: ${Spacing["spacing-16"]};
`;
