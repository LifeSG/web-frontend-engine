import { css } from "@linaria/core";
import { Border, Colour } from "@lifesg/react-design-system/theme";

export const chipButton = css`
	background-color: ${Colour.bg};
	border: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	border-radius: 1rem;
	display: inline-block;
	padding: 0.063rem 0.438rem;
	overflow-wrap: anywhere;

	&:hover {
		box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 1px #024fa9;
	}
`;

export const chipButtonDisabled = css`
	&:hover {
		cursor: not-allowed;
	}
`;

export const chipButtonActive = css`
	background-color: ${Colour["bg-inverse-subtlest"]};
`;

export const chipTextActive = css`
	color: ${Colour["text-inverse"]};
`;
