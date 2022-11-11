import styled from "styled-components";
import { FrontendEngine } from "../components";
import { ISubmitButtonSchema } from "../components/fields";

export const ExcludeReactFormHookProps = {
	invalid: { table: { disable: true } },
	isTouched: { table: { disable: true } },
	isDirty: { table: { disable: true } },
	error: { table: { disable: true } },
	onChange: { table: { disable: true } },
	onBlur: { table: { disable: true } },
	value: { table: { disable: true } },
	name: { table: { disable: true } },
};

export const CommonFieldStoryProps = (fieldType: string) => ({
	fieldType: {
		description: `Use <code>${fieldType}</code> to show this field`,
		table: {
			type: {
				summary: "string",
			},
		},
		type: { name: "string", required: true },
		options: [fieldType],
		control: {
			type: "select",
		},
	},
	label: {
		description: "A name/description of the purpose of the form element",
		table: {
			type: {
				summary: "string",
			},
		},
		control: {
			type: "text",
		},
	},
});

export const SubmitButtonStorybook: Record<string, ISubmitButtonSchema> = {
	"submit-button": { fieldType: "submit", label: "Submit" },
};

export const StyledForm = styled(FrontendEngine)`
	width: 350px;
`;
