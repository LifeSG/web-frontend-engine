import { Spacing } from "@lifesg/react-design-system/theme";
import { Form } from "@lifesg/react-design-system/form";
import styled, { css } from "styled-components";

interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	resizable?: boolean | undefined;
}

// =============================================================================
// STYLING
// =============================================================================
export const Wrapper = styled.div<{ chipPosition?: "top" | "bottom" | undefined }>`
	display: flex;
	flex-direction: ${({ chipPosition }) => (chipPosition !== "bottom" ? "column" : "column-reverse")};
`;

export const ChipContainer = styled.div<{ $chipPosition?: "top" | "bottom" | undefined }>`
	margin: ${({ $chipPosition }) =>
		$chipPosition === "bottom"
			? `${Spacing["spacing-16"]} 0 ${Spacing["spacing-8"]}`
			: `${Spacing["spacing-8"]} 0 ${Spacing["spacing-16"]}`};
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-8"]};
`;

export const StyledTextarea = styled(Form.Textarea)<ITextareaProps>`
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
