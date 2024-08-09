import { Source, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { FrontendEngine, IFrontendEngineProps } from "../../../components";
import { SUBMIT_BUTTON_SCHEMA } from "../../common";
import { IValidationComponentProps, ValidationComponent } from "./validation-component";

const meta: Meta = {
	title: "Form/Validation Schema",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Validation Schema</Title>
					<p>
						These are the individual rules to define the validation logic of the field in the JSON schema.
						They are used in the `validation` property of each field. The snippet below illustrates a
						TEXTAREA field with `required` and `max` validation.
					</p>
					<Source
						code={`
{
	//...
	"data": {
		"fields": {
			"name": {
				label: "What is your name",
				uiType: "textarea",
				validation: [
					{ required: true },
					{ max: 255, errorMessage: "Maximum length of 255" },
				],
				chipTexts: ["John", "Doe"],
			},
			//...
		}
	}
}
						`}
					/>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
			source: {
				code: null,
			},
		},
	},
	argTypes: {
		type: {
			table: { disable: true },
		},
	},
};
export default meta;

const Template: StoryFn<IValidationComponentProps> = (args) => (
	<ValidationComponent type={args.type} rule={args.rule} value={args.value} />
);

export const Required = Template.bind({});
Required.args = {
	type: "string",
	rule: { required: true, errorMessage: "Field is required" },
	value: { name: undefined },
};

export const Empty = Template.bind({});
Empty.args = {
	type: "string",
	rule: { empty: true, errorMessage: "Must be empty" },
	value: { name: "hello world" },
};

export const Equals = Template.bind({});
Equals.args = {
	type: "string",
	rule: { equals: "hello world", errorMessage: "Must be `hello world`" },
	value: { name: "lorem" },
};

export const NotEquals = Template.bind({});
NotEquals.args = {
	type: "string",
	rule: { notEquals: "hello world", errorMessage: "Must not be `hello world`" },
	value: { name: "hello world" },
};

export const SoftValidation: StoryFn<IFrontendEngineProps> = (args) => <FrontendEngine {...args} />;
SoftValidation.args = {
	data: {
		sections: {
			section: {
				uiType: "section",
				children: {
					name: {
						label: "What is your name",
						uiType: "text-field",
						validation: [{ required: true }, { max: 5, soft: true, errorMessage: "Maximum length of 5" }],
					},
					email: {
						label: "Email address",
						uiType: "email-field",
						validation: [{ required: true }],
					},
					sex: {
						uiType: "select",
						label: "Sex",
						options: [
							{ label: "Male", value: "male" },
							{ label: "Female", value: "female" },
						],
						validation: [{ required: true, soft: true, errorMessage: "This field is optional" }],
					},
					...SUBMIT_BUTTON_SCHEMA,
				},
			},
		},
		defaultValues: {
			name: "Erik Tan",
		},
	},
};
