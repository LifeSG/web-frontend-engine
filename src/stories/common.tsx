import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import { IFrontendEngineProps, IYupValidationRule, FrontendEngine as OriginalFrontendEngine } from "../components";
import { ISubmitButtonSchema } from "../components/fields";
import { IFrontendEngineRef, TNoInfer } from "../components/frontend-engine";
import { ReactElement, Ref, forwardRef } from "react";

const EXCLUDED_STORY_PROPS = {
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
			...EXCLUDED_STORY_PROPS,
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
		...EXCLUDED_STORY_PROPS,
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
			type: { name: "object" },
			defaultValue: [],
		},
		showIf: {
			description:
				"A set of conditions to render the field. For more info, refer to the <a href='/docs/form-conditional-rendering--filled'>Conditional Rendering</a> stories",
			table: {
				type: {
					summary: "array",
				},
			},
			type: { name: "object" },
			defaultValue: [],
		},
	};
};

export const CommonCustomStoryProps = (referenceKey: string) => {
	return {
		referenceKey: {
			description: `Use <code>${referenceKey}</code> to show this field`,
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: [referenceKey],
			control: {
				type: "text",
			},
			defaultValue: referenceKey,
		},
		label: {
			description: "A name/description of the purpose of the element",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
	};
};

export const SUBMIT_BUTTON_SCHEMA: Record<string, ISubmitButtonSchema> = {
	"submit-button": { uiType: "submit", label: "Submit" },
};

const StyledForm = styled(OriginalFrontendEngine)`
	width: 400px;
`;

// naming it as `FrontendEngine` because this is shown in code view
export const FrontendEngine = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => (
	<StyledForm
		onChange={(values, isValid) => action("change")(values, isValid)}
		onSubmit={(e) => action("submit")(e)}
		ref={ref}
		{...props}
	/>
)) as <V = undefined>(
	props: IFrontendEngineProps<TNoInfer<V, IYupValidationRule>> & { ref?: Ref<IFrontendEngineRef> }
) => ReactElement;

export const LOREM_IPSUM = (prefix: string) => {
	const codePrefix = `<code>${prefix}</code>`;

	return `${prefix && codePrefix + " : "}Lorem ipsum dolor sit`;
};
