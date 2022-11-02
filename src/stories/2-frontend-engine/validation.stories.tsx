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

export const Length = Template.bind({});
Length.args = {
	type: "string",
	rule: { length: 10, errorMessage: "Invalid length" },
	value: { name: "hello world" },
};

export const MinString = Template.bind({});
MinString.storyName = "Min (String)";
MinString.args = {
	type: "string",
	rule: { min: 5, errorMessage: "Min 5 characters" },
	value: { name: "a" },
};

export const MinNumber = Template.bind({});
MinNumber.storyName = "Min (Number)";
MinNumber.args = {
	type: "number",
	rule: { min: 5, errorMessage: "Min 5" },
	value: { name: 4 },
};

export const MinArray = Template.bind({});
MinArray.storyName = "Min (Array)";
MinArray.args = {
	type: "array",
	rule: { min: 5, errorMessage: "Min 5 items" },
	value: { name: [1, 2, 3] },
};

export const MaxString = Template.bind({});
MaxString.storyName = "Max (String)";
MaxString.args = {
	type: "string",
	rule: { max: 5, errorMessage: "Max 5 characters" },
	value: { name: "abcdef" },
};

export const MaxNumber = Template.bind({});
MaxNumber.storyName = "Max (Number)";
MaxNumber.args = {
	type: "number",
	rule: { max: 5, errorMessage: "Max 5" },
	value: { name: 6 },
};

export const MaxArray = Template.bind({});
MaxArray.storyName = "Max (Array)";
MaxArray.args = {
	type: "array",
	rule: { max: 5, errorMessage: "Max 5 items" },
	value: { name: [1, 2, 3, 4, 5, 6] },
};

export const Matches = Template.bind({});
Matches.args = {
	type: "string",
	rule: { matches: "/^(hello)/", errorMessage: "Need to begin with `hello`" },
	value: { name: "lorem ipsum" },
};

export const Email = Template.bind({});
Email.args = {
	type: "string",
	rule: { email: true, errorMessage: "Invalid email" },
	value: { name: "lorem ipsum" },
};

export const Url = Template.bind({});
Url.args = {
	type: "string",
	rule: { url: true, errorMessage: "Invalid url" },
	value: { name: "lorem ipsum" },
};

export const UUID = Template.bind({});
UUID.args = {
	type: "string",
	rule: { uuid: true, errorMessage: "Invalid uuid" },
	value: { name: "lorem ipsum" },
};

export const When = Template.bind({});
When.args = {
	type: "string",
	rule: {
		when: {
			field2: {
				is: "something",
				then: [
					{
						required: true,
						errorMessage: "Name is required when field2=something",
					},
				],
				otherwise: [
					{
						min: 5,
						errorMessage: "Name must have at least 5 characters when field2!=something",
					},
				],
			},
		},
	},
	value: { name: undefined, field2: "something" },
};
