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

export const CommonFieldStoryProps = (fieldType: string, onlyFieldType = false) => {
	if (onlyFieldType) {
		return {
			[`${fieldType}-default`]: { table: { disable: true } },
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
				defaultValue: fieldType,
			},
		};
	}
	return {
		[`${fieldType}-default`]: { table: { disable: true } },
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
		validation: {
			description:
				"A set of config to ensure the value is acceptable before submission. For more info, refer to the <a href='/docs/form-validation-schema--required'>Validation Schema</a> stories",
			table: {
				type: {
					summary: "array",
				},
			},
			type: { name: "object", value: {} },
		},
		showIf: {
			description:
				"A set of conditions to render the field. For more info, refer to the <a href='/docs/form-conditional-rendering--filled'>Conditional Rendering</a> stories",
			table: {
				type: {
					summary: "array",
				},
			},
			type: { name: "object", value: {} },
		},
	};
};

export const SubmitButtonStorybook: Record<string, ISubmitButtonSchema> = {
	"submit-button": { fieldType: "submit", label: "Submit" },
};

export const StyledForm = styled(FrontendEngine)`
	width: 350px;
`;

export const LOREM_IPSUM = (prefix: string) => `${prefix && prefix + " :"} Lorem ipsum dolor sit amet`;
