import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import { IValidationComponentProps, ValidationComponent } from "./validation-component";

export default {
	title: "Form/Validation Schema",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Validation Schema</Title>
					<Description>
						These are the individual rules to define the validation logic of the field in the JSON schema.
						They are used in the `validation` property of each field. The snippet below illustrates a
						TEXTAREA field with `required` and `max` validation.
					</Description>
					<pre>
						{`
	{
		//...
		"data": {
			"fields": {
				"name": {
					label: "What is your name",
					fieldType: "textarea",
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
					</pre>
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
} as Meta;

const Template: Story<IValidationComponentProps> = (args) => (
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
