import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ITextfieldSchema } from "src/components/fields";
import { FrontendEngine } from "../../..";
import { ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/Textfield",
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
		textfield: { table: { disable: true } },
		fieldType: {
			description: `Use <code>text</code> or <code>email</code> or <code>number</code> to show this field`,
			table: {
				type: {
					summary: "text|email|number",
				},
			},
			type: { name: "string", required: true },
			options: ["text", "email", "number"],
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
		disabled: {
			description: "Specifies if the textfield is interactable",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
	},
} as Meta;

const Template: Story<Record<string, ITextfieldSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	textfield: {
		label: "Textfield",
		fieldType: "text",
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"textfield-default-value": {
					label: "Textfield",
					fieldType: "text",
				},
				...SubmitButtonStorybook,
			},
			defaultValues: {
				"textfield-default-value": "This is the default value",
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"textfield-disabled": {
		label: "Textfield",
		fieldType: "text",
		disabled: true,
	},
};

export const Email = Template.bind({});
Email.args = {
	"textfield-email": {
		label: "Textfield (Email)",
		fieldType: "email",
	},
};

export const EmailCustomError = Template.bind({});
EmailCustomError.storyName = "Email with custom error message";
EmailCustomError.args = {
	"textfield-email-error": {
		label: "Textfield (Email)",
		fieldType: "email",
		validation: [{ email: true, errorMessage: "Please use a valid email" }],
	},
};

export const MaxLength = Template.bind({});
MaxLength.args = {
	"textfield-maxlength": {
		label: "Textfield",
		fieldType: "text",
		maxLength: 5,
	},
};

export const Number = Template.bind({});
Number.args = {
	"textfield-number": {
		label: "Textfield",
		fieldType: "number",
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"textfield-placeholder": {
		label: "Textfield",
		fieldType: "number",
		placeholder: "Enter text here",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"textfield-with-validation": {
		label: "Textfield",
		fieldType: "text",
		validation: [{ required: true }],
	},
};
