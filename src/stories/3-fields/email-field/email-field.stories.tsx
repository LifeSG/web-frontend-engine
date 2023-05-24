import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { IEmailFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, DefaultStoryTemplate, ResetStoryTemplate } from "../../common";

export default {
	title: "Field/EmailField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>EmailField</Title>
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
		...CommonFieldStoryProps("email-field"),
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		disabled: {
			description: "Specifies if the textfield is interactable",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		customOptions: {
			description:
				"<ul><li>`preventCopyAndPaste` prop accept `boolean` and also can be `undefined`. If value is true then it will prevent user from copy pasting.</li><li>`preventDragAndDrop` prop accept `boolean` and also can be `undefined`. If value is true then it will prevent user from drag and drop.</li></ul>",
			table: {
				type: {
					summary: `{preventCopyAndPaste?: boolean, preventCopyPaste?: boolean}`,
				},
			},
			defaultValue: { PreventCopyAndPaste: false, PreventDragAndDrop: false },
			control: { type: "object" },
		},
	},
} as Meta;

export const Default = DefaultStoryTemplate<IEmailFieldSchema>("email-default").bind({});
Default.args = {
	label: "Email",
	uiType: "email-field",
};

export const DefaultValue = DefaultStoryTemplate<IEmailFieldSchema>("email-default-value").bind({});
DefaultValue.args = {
	label: "Email",
	uiType: "email-field",
	defaultValues: "default@domain.tld",
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};

export const Disabled = DefaultStoryTemplate<IEmailFieldSchema>("email-disabled").bind({});
Disabled.args = {
	label: "Email",
	uiType: "email-field",
	disabled: true,
};

export const CustomErrorMessage = DefaultStoryTemplate<IEmailFieldSchema>("email-email-error").bind({});
CustomErrorMessage.args = {
	label: "Email",
	uiType: "email-field",
	validation: [{ email: true, errorMessage: "Please use a valid email" }],
};

export const MaxLength = DefaultStoryTemplate<IEmailFieldSchema>("textfield-maxlength").bind({});
MaxLength.args = {
	label: "Email",
	uiType: "email-field",
	validation: [{ max: 5 }],
};

export const Placeholder = DefaultStoryTemplate<IEmailFieldSchema>("email-placeholder").bind({});
Placeholder.args = {
	label: "Email",
	uiType: "email-field",
	placeholder: "Enter an email",
};

export const WithValidation = DefaultStoryTemplate<IEmailFieldSchema>("email-with-validation").bind({});
WithValidation.args = {
	label: "Email",
	uiType: "email-field",
	validation: [{ required: true }],
};

export const PreventCopyAndPaste = DefaultStoryTemplate<IEmailFieldSchema>("prevent-copy-and-paste").bind({});
PreventCopyAndPaste.args = {
	label: "Email",
	uiType: "email-field",
	customOptions: {
		preventCopyAndPaste: true,
	},
};

export const PreventDragAndDrop = DefaultStoryTemplate<IEmailFieldSchema>("prevent-drag-and-drop").bind({});
PreventDragAndDrop.args = {
	label: "Textfield",
	uiType: "email-field",
	customOptions: {
		preventDragAndDrop: true,
	},
};
export const Reset = ResetStoryTemplate<IEmailFieldSchema>("email-reset").bind({});
Reset.args = {
	uiType: "email-field",
	label: "Email",
};

export const ResetWithDefaultValues = ResetStoryTemplate<IEmailFieldSchema>("email-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	uiType: "email-field",
	label: "Email",
	defaultValues: "default@domain.tld",
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};
