import { Form } from "react-lifesg-design-system";
import styled, { css } from "styled-components";
import { IAutoResizeTextareaProps } from "./types";

// =============================================================================
// STYLING
// =============================================================================
export const AutoResizeTextareaContainer = styled(Form.Textarea)<IAutoResizeTextareaProps>`
	width: auto;

	${(props) =>
		!props.resizable
			? css`
					resize: none;
					height: auto;
			  `
			: css`
					resize: vertical;
					height: auto;
					max-height: 37.5rem;
					min-height: ${props.rows ? props.rows + 2 * 22 + 24 + "px" : "5rem"};
			  `}
`;
