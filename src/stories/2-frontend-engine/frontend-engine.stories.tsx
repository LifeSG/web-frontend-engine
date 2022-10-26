import { Button } from "@lifesg/react-design-system/button";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import React, { useRef } from "react";
import { FrontendEngine, IFrontendEngineProps, IFrontendEngineRef } from "src/components/frontend-engine";
import { SubmitButtonStorybook } from "../common";

export default {
	title: "Form/Frontend Engine",
	component: FrontendEngine,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>FrontendEngine</Title>
					<Description>
						The main component to render a form, based on a JSON schema through the `data` prop.
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		data: {
			description: "JSON configuration to define the fields and functionalities of the form",
			table: {
				type: {
					summary: "IFrontendEngineData",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
		"data.className": {
			description: "HTML class attribute",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"data.defaultValues": {
			description:
				"Fields' initial values on mount. The key of each field needs to match the id used in the field.",
			table: {
				type: {
					summary: "TFrontendEngineValues",
				},
			},
		},
		"data.fields": {
			description: "All elements within the form. For more info, refer to individual field stories.",
			table: {
				type: {
					summary: "Record<string, TFrontendEngineFieldSchema>",
				},
			},
			control: {
				type: null,
			},
			type: { name: "object", value: {}, required: true },
		},
		"data.id": {
			description: "Unique HTML id attribute that is also assigned to the `data-testid`",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"data.revalidationMode": {
			description:
				" Validation strategy when inputs with errors get re-validated after a user submits the form (onSubmit event).",
			table: {
				type: {
					summary: "TRevalidationMode",
					detail: "onChange | onBlur | onSubmit",
				},
				defaultValue: {
					summary: "onChange",
				},
			},
		},
		"data.validationMode": {
			description: "Validation strategy before a user submits the form (onSubmit event)",
			table: {
				type: {
					summary: "TValidationMode",
					detail: "onBlur | onChange | onSubmit",
				},
				defaultValue: {
					summary: "onSubmit",
				},
			},
		},
		onSubmit: {
			description: "Submit event handler, will receive the form data if form validation is successful",
			table: {
				type: {
					summary: "(values: TFrontendEngineValues) => unknown",
				},
			},
		},
	},
} as Meta;

const Template: Story<IFrontendEngineProps> = (args) => <FrontendEngine {...args} />;

export const Default = Template.bind({});
Default.args = {
	data: {
		validationMode: "onSubmit",
		revalidationMode: "onChange",
		fields: {
			name: {
				label: "What is your name",
				fieldType: "textarea",
				validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
				chipTexts: ["John", "Doe"],
			},
			...SubmitButtonStorybook,
		},
		defaultValues: {
			name: "Erik Tan",
		},
	},
};

export const ValidateOnChange = Template.bind({});
ValidateOnChange.args = {
	data: {
		validationMode: "onChange",
		revalidationMode: "onChange",
		fields: {
			name: {
				label: "What is your name",
				fieldType: "textarea",
				validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
				chipTexts: ["John", "Doe"],
			},
			...SubmitButtonStorybook,
		},
		defaultValues: {
			name: "Erik Tan",
		},
	},
};

export const ValidateOnBlur = Template.bind({});
ValidateOnBlur.args = {
	data: {
		validationMode: "onBlur",
		revalidationMode: "onChange",
		fields: {
			name: {
				label: "What is your name",
				fieldType: "textarea",
				validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
				chipTexts: ["John", "Doe"],
			},
			...SubmitButtonStorybook,
		},
		defaultValues: {
			name: "Erik Tan",
		},
	},
};

export const ExternalSubmit: Story<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		ref.current.submit();
	};

	return (
		<>
			<FrontendEngine
				data={{
					fields: {
						name: {
							label: "What is your name",
							fieldType: "textarea",
							validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
							chipTexts: ["John", "Doe"],
						},
					},
					defaultValues: {
						name: "Erik Tan",
					},
				}}
				ref={ref}
			/>
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				My custom submit button
			</Button.Default>
		</>
	);
};
ExternalSubmit.storyName = "External Submit Button";
ExternalSubmit.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const GetFormState: Story<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		console.log(ref.current.getFormState());
	};

	return (
		<>
			<FrontendEngine
				data={{
					fields: {
						name: {
							label: "What is your name",
							fieldType: "textarea",
							validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
							chipTexts: ["John", "Doe"],
						},
						...SubmitButtonStorybook,
					},
					defaultValues: {
						name: "Erik Tan",
					},
				}}
				ref={ref}
			/>
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Get form state (check console)
			</Button.Default>
		</>
	);
};
GetFormState.parameters = {
	controls: { hideNoControlsWarning: true },
};
