import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import { FrontendEngine, ITextfieldSchema, TextField } from "../../..";
import { ExcludeReactFormHookProps } from "../../common";

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
		...ExcludeReactFormHookProps,
		schema: {
			description: "Defined JSON schema props",
			table: {
				type: {
					summary: "ITextfieldSchema",
					required: true,
					detail: `
{
	id: string;
	title: string;
	type: "TEXT" | "NUMBER" | "EMAIL";
	validation: IValidationRule[];
}`,
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
