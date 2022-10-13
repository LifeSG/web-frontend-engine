import { Form } from "@lifesg/react-design-system/form";
import { Chip } from "src/components/shared";
import styled, { css } from "styled-components";

interface ITextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	maxLength?: number;
	resizable?: boolean;
}

// =============================================================================
// STYLING
// =============================================================================
export const Wrapper = styled.div<{ chipPosition?: "top" | "bottom" }>`
	display: flex;
	flex-direction: ${({ chipPosition }) => (chipPosition !== "bottom" ? "column" : "column-reverse")};
`;

export const ChipContainer = styled.div`
	margin-top: 0.438rem;
`;

export const ChipItem = styled(Chip)`
	margin-bottom: 0.5rem;
	margin-right: 0.5rem;
`;

export const StyledTextArea = styled(Form.Textarea)<ITextAreaProps>`
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
