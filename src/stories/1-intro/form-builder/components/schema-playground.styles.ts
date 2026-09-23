import { css } from "@linaria/core";
import { Border, Colour, Radius, Spacing } from "@lifesg/react-design-system/theme";

export const wrapper = css`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${Spacing["spacing-32"]};
	width: 100%;
	height: 80vh;
	box-sizing: border-box;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		height: auto;
	}
`;

export const editorPanel = css`
	display: flex;
	flex-direction: column;
	gap: ${Spacing["spacing-16"]};
	min-height: 0;
`;

export const editorContainer = css`
	flex: 1;
	display: flex;
	border: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	border-radius: ${Radius.sm};
	overflow: hidden;
	min-height: 0;
`;

export const lineGutter = css`
	padding: ${Spacing["spacing-16"]} ${Spacing["spacing-8"]};
	background: ${Colour["bg-primary-subtlest"]};
	color: ${Colour["text-subtler"]};
	font-family: monospace;
	font-size: 0.875rem;
	line-height: 1.5;
	text-align: right;
	user-select: none;
	overflow: hidden;
	box-sizing: border-box;
	min-width: 3rem;
`;

export const textarea = css`
	flex: 1;
	resize: none;
	padding: ${Spacing["spacing-16"]};
	border: none;
	outline: none;
	font-family: monospace;
	font-size: 0.875rem;
	line-height: 1.5;
	overflow: auto;
	box-sizing: border-box;
	white-space: pre;
`;

export const previewPanel = css`
	overflow-y: auto;
	padding: ${Spacing["spacing-16"]};
	border: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	border-radius: ${Radius.sm};

	@media (max-width: 768px) {
		min-height: 50vh;
	}
`;

export const parseError = css`
	color: ${Colour["text-error"]};
	font-family: monospace;
	font-size: 0.875rem;
	white-space: pre-wrap;
	margin: 0;
`;

export const errorBoundaryFallback = css`
	display: flex;
	flex-direction: column;
	gap: ${Spacing["spacing-16"]};
`;

export const errorDetails = css`
	color: ${Colour["text-error"]};
	font-size: 0.875rem;
	white-space: pre-wrap;
	margin: 0;
	padding: ${Spacing["spacing-16"]};
	background: ${Colour["bg-primary-subtlest"]};
	border-radius: ${Radius.sm};
	overflow: auto;
`;
