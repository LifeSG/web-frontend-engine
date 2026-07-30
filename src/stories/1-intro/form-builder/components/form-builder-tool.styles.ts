import { css } from "@linaria/core";
import { Border, Colour, Radius, Spacing } from "@lifesg/react-design-system/theme";

// =============================================================================
// STYLING
// =============================================================================
export const wrapper = css`
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export const contentWrapper = css`
	display: block;
	width: 100%;
	flex: 1;
	overflow-y: auto;
`;

export const contentWrapperHidden = css`
	display: none;
`;

export const contentWrapperFlexbox = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	gap: ${Spacing["spacing-32"]};
	padding: ${Spacing["spacing-32"]};
`;

export const toolbar = css`
	position: relative;
	display: flex;
	width: 100%;
	height: 5rem;
	justify-content: flex-end;
	z-index: 1;
	gap: ${Spacing["spacing-32"]};
	padding: ${Spacing["spacing-16"]};
	background-color: ${Colour["bg-primary-subtlest"]};
	box-sizing: border-box;
`;

export const modeButton = css`
	background: transparent;
	color: ${Colour["icon-primary"]};
	display: grid;
	cursor: pointer;
	border: none;
	border-radius: ${Radius.sm};
	padding: ${Spacing["spacing-16"]};
	align-self: center;

	&:hover {
		background: ${Colour["bg-selected-hover"]};
	}

	&:focus {
		outline-color: ${Colour["border-focus"]};
	}

	svg {
		width: 1.625rem;
		height: 1.625rem;
	}
`;

export const modeButtonActive = css`
	background: ${Colour["bg-primary-subtlest-selected"]};
`;

export const frontendEnginePreview = css`
	width: 100%;
	margin-bottom: ${Spacing["spacing-32"]};
`;

export const schemaEditorWrapper = css`
	display: flex;
	flex-direction: column;
	width: 100%;
	flex: 1;

	> div {
		flex: 1;
	}
`;

export const schemaEditor = css`
	flex: 1;
	width: 100%;
	overflow: auto;
	padding: ${Spacing["spacing-16"]};
	border: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	border-radius: ${Radius.sm};
`;

export const saveButton = css`
	width: 10rem;
	margin-left: auto;
`;

export const actionWrapper = css`
	display: flex;
	width: 100%;
	gap: 2rem;
`;

export const alertWrapper = css`
	flex-grow: 1;
`;

export const refreshButton = css`
	display: inline;
	padding: 0;
`;
