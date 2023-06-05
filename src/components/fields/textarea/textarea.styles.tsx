import { Textarea } from "@lifesg/react-design-system/input-textarea";
import styled, { css } from "styled-components";

interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	maxLength?: number | undefined;
	resizable?: boolean | undefined;
}

// =============================================================================
// STYLING
// =============================================================================
export const Wrapper = styled.div<{ chipPosition?: "top" | "bottom" | undefined }>`
	display: flex;
	flex-direction: ${({ chipPosition }) => (chipPosition !== "bottom" ? "column" : "column-reverse")};
`;

export const ChipContainer = styled.div`
	margin: 0.5rem 0rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
`;

export const StyledTextarea = styled(Textarea)<ITextareaProps>`
	width: auto;

	${(props) =>
		!props.resizable
			? css`
					resize: none;
			  `
			: css`
					resize: vertical;
					max-height: 37.5rem;
					min-height: ${props.rows ? `${props.rows + 2 * 22 + 24}px` : "5rem"};
			  `}
`;
