import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine, ITextfieldSchema } from "../../..";
import { ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/TextField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TextField</Title>
					<Description>A form element that contains a label, input and error message</Description>
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
		id: {
			description: "The unique identifier of the component",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			control: {
				type: "text",
			},
		},
		type: {
			description: "Use <code>TEXTFIELD</code> to show this field",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: ["TEXTFIELD"],
			control: {
				type: "select",
			},
		},
		title: {
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
		maxLength: {
			description: "A specified maximum length for the value of the form element",
			table: {
				type: {
					summary: "number",
				},
			},
			control: {
				type: "number",
			},
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
	},
} as Meta;

const Template: Story<ITextfieldSchema> = (args) => (
	<FrontendEngine
		id="frontendEngine"
		validationMode="onSubmit"
		data={{
			fields: [args, SubmitButtonStorybook],
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	id: "textfield-default",
	title: "Textfield",
	type: "TEXT",
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
	id: "textfield-default-value",
	title: "Textfield",
	type: "TEXT",
	defaultValue: "Default",
};

export const Disabled = Template.bind({});
Disabled.args = {
	id: "textfield-disabled",
	title: "Textfield",
	type: "TEXT",
	disabled: true,
};

export const Email = Template.bind({});
Email.args = {
	id: "textfield-email",
	title: "Textfield (Email)",
	type: "EMAIL",
};

export const MaxLength = Template.bind({});
MaxLength.args = {
	id: "textfield-maxlength",
	title: "Textfield",
	type: "TEXT",
	maxLength: 5,
};

export const Number = Template.bind({});
Number.args = {
	id: "textfield-number",
	title: "Textfield (Number)",
	type: "NUMBER",
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	id: "textfield-placeholder",
	title: "Textfield",
	type: "TEXT",
	placeholder: "Enter text here",
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	id: "textfield-with-validation",
	title: "Textfield",
	type: "TEXT",
	validation: [{ required: true }],
};
