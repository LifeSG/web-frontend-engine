import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import { FrontendEngine, ITextfieldSchema, TextField } from "../../..";
import { ExcludeReactFormHookProps } from "../../common";

const ExcludeDefaultProps = {
	id: { table: { disable: true } },
	title: { table: { disable: true } },
	type: { table: { disable: true } },
};

export default {
	title: "Field/TextField",
	component: TextField,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TextField</Title>
					<Description>
						A form element that renders a multi-line textfield component with optional suggestion pills
					</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
						attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		invalid: { table: { disable: true } },
		...ExcludeReactFormHookProps,
		...ExcludeDefaultProps,
		schema: {
			description:
				"Acual component props, it is same as the schema used to define the field through the JSON schema",
			table: {
				type: {
					summary: "ITextfieldSchema",
				},
			},
		},
		"schema.id": {
			description: "The unique identifier of the component",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"schema.title": {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"schema.errorMessage": {
			description: "A message that describes the error/issue with the value of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"schema.maxLength": {
			description: "A specified maximum length for the value of the form element",
			table: {
				type: {
					summary: "number",
				},
			},
		},
		"schema.inputMode": {
			description: "An enumerated attribute that hints the type of data that might be entered by user",
			table: {
				type: {
					summary: "none | text | tel | url | email | numeric | decimal | search | undefined",
				},
			},
		},
	},
} as Meta;

const Template: Story<ITextfieldSchema> = (args) => (
	<FrontendEngine
		id="frontendEngine"
		validationMode="onSubmit"
		data={{
			fields: [args],
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	id: "textfield-default",
	title: "Textfield",
	type: "TEXT",
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	id: "textfield-with-validation",
	title: "Textfield with Validation",
	type: "TEXT",
	validation: [{ required: true }],
};
