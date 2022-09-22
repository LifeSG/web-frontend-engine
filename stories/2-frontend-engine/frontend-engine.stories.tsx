import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs/blocks";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import { FrontendEngine } from "../../src";
import { IFrontendEngineProps } from "../../src/types";

export default {
	title: "Form/Frontend Engine",
	component: FrontendEngine,
	argTypes: {
		id: {
			description: "Unique HTML id attribute that is also assigned to the `data-testid`",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		className: {
			description: "HTML class attribute",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		data: {
			description: "JSON configuration to define the fields and functionalities of the form",
			table: {
				type: {
					summary: "JSON",
				},
			},
		},
		initialValues: {
			description: "**For custom rendering only:** Fields' initial values on mount",
			table: {
				type: {
					summary: "TFrontendEngineValues",
				},
			},
		},
		validationSchema: {
			description: "**For custom rendering only:** Formik's validation schema based on `Yup`",
			table: {
				type: {
					summary: "Yup.AnyObjectSchema",
				},
			},
		},
		validators: {
			description: "Custom `Yup` validation rules",
			table: {
				type: {
					summary: "IFrontendEngineValidator[]",
				},
			},
		},
		conditions: {
			description: "Custom conditional rendering rules",
			table: {
				type: {
					summary: "IFrontendEngineCondition[]",
				},
			},
		},
		validationMode: {
			description: "Form validation behaviour",
			table: {
				type: {
					summary: "keyof ValidationMode",
				},
			},
		},
		onSubmit: {
			description: "Submit event handler",
			table: {
				type: {
					summary: "(values: TFrontendEngineValues) => unknown",
				},
			},
		},
		onValidate: {
			description: "Validate event handler",
			table: {
				type: {
					summary: "(isValid: boolean) => void",
				},
			},
		},
	},
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>FrontendEngine</Title>
					<Description>
						The main component to render a form, based on a JSON schema through the `data` prop or through
						manually defined children (custom rendering).
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
} as Meta;

const Template: Story<IFrontendEngineProps> = (args) => {
	return <FrontendEngine {...args} />;
};

export const Default = Template.bind({});
Default.args = {
	id: "Sample Form",
	validationMode: "onSubmit",
	data: {
		fields: [
			{
				id: "name",
				title: "What is your name",
				type: "TEXTAREA",
				validation: ["required", "number"],
				chipTexts: ["abc", "def"],
			},
		],
	},
};
