import { Spacing } from "@lifesg/react-design-system/theme";
import { Form } from "@lifesg/react-design-system/form";
import styled from "styled-components";

interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	$resizable?: boolean;
}

// =============================================================================
// STYLING
// =============================================================================
export const tokens = {
	styledTextarea: {
		minHeight: "--fee-internal-textarea-styledTextarea-minHeight",
	},
};

export const Wrapper = styled.div`
	display: flex;

	&.textareaWrapperChipPositionTop {
		flex-direction: column;
	}

	&.textareaWrapperChipPositionBottom {
		flex-direction: column-reverse;
	}
`;

export const ChipContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-8"]};

	&.textareaChipContainerChipPositionTop {
		margin: ${Spacing["spacing-8"]} 0 ${Spacing["spacing-16"]};
	}

	&.textareaChipContainerChipPositionBottom {
		margin: ${Spacing["spacing-16"]} 0 ${Spacing["spacing-8"]};
	}
`;

export const StyledTextarea = styled(Form.Textarea)<ITextareaProps>`
	width: auto;
	${tokens.styledTextarea.minHeight}: initial;

	&.styledTextareaNotResizable {
		resize: none;
	}

	&.styledTextareaResizable {
		resize: vertical;
		max-height: 37.5rem;
		min-height: var(${tokens.styledTextarea.minHeight}, 5rem);
	}
`;
