import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { ITextfieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

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
		...CommonFieldStoryProps("text"),
		"textfield-default": { table: { disable: true } },
		fieldType: {
			description: `Use <code>text</code> or <code>email</code> or <code>numeric</code> to show this field`,
			table: {
				type: {
					summary: "text|email|numeric",
				},
			},
			type: { name: "string", required: true },
			options: ["text", "email", "numeric"],
			control: {
				type: "select",
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
	"textfield-default": {
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

export const MaxLength = Template.bind({});
MaxLength.args = {
	"textfield-maxlength": {
		label: "Textfield",
		fieldType: "text",
		maxLength: 5,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"textfield-placeholder": {
		label: "Textfield",
		fieldType: "text",
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
