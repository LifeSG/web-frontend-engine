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

export const CommonFieldStoryProps = (uiType: string, onlyFieldType = false) => {
	if (onlyFieldType) {
		return {
			[`${uiType}-default`]: { table: { disable: true } },
			uiType: {
				description: `Use <code>${uiType}</code> to show this field`,
				table: {
					type: {
						summary: "string",
					},
				},
				type: { name: "string", required: true },
				options: [uiType],
				control: {
					type: "select",
				},
				defaultValue: uiType,
			},
		};
	}
	return {
		[`${uiType}-default`]: { table: { disable: true } },
		uiType: {
			description: `Use <code>${uiType}</code> to show this field`,
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: [uiType],
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
	"submit-button": { uiType: "submit", label: "Submit" },
};

export const StyledForm = styled(FrontendEngine)`
	width: 350px;
`;

export const LOREM_IPSUM = (prefix: string) => {
	const codePrefix = `<code>${prefix}</code>`;

	return `${prefix && codePrefix + " : "}Lorem ipsum dolor sit`;
};
