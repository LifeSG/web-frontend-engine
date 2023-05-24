import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { ITextFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, DefaultStoryTemplate, ResetStoryTemplate } from "../../common";

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
		...CommonFieldStoryProps("text-field"),
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

export const Default = DefaultStoryTemplate<ITextFieldSchema>("text-default").bind({});
Default.args = {
	label: "Textfield",
	uiType: "text-field",
};

export const DefaultValue = DefaultStoryTemplate<ITextFieldSchema>("text-default-value").bind({});
DefaultValue.args = {
	label: "Textfield",
	uiType: "text-field",
	defaultValues: "This is the default value",
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

export const Disabled = DefaultStoryTemplate<ITextFieldSchema>("text-disabled").bind({});
Disabled.args = {
	label: "Textfield",
	uiType: "text-field",
	disabled: true,
};

export const MaxLength = DefaultStoryTemplate<ITextFieldSchema>("text-maxlength").bind({});
MaxLength.args = {
	label: "Textfield",
	uiType: "text-field",
	validation: [{ max: 5 }],
};

export const Placeholder = DefaultStoryTemplate<ITextFieldSchema>("text-placeholder").bind({});
Placeholder.args = {
	label: "Textfield",
	uiType: "text-field",
	placeholder: "Enter text here",
};

export const WithValidation = DefaultStoryTemplate<ITextFieldSchema>("text-with-validation").bind({});
WithValidation.args = {
	label: "Textfield",
	uiType: "text-field",
	validation: [{ required: true }],
};

export const PreventCopyAndPaste = DefaultStoryTemplate<ITextFieldSchema>("prevent-copy-and-paste").bind({});
PreventCopyAndPaste.args = {
	label: "Textfield",
	uiType: "text-field",
	customOptions: {
		preventCopyAndPaste: true,
	},
};

export const PreventDragAndDrop = DefaultStoryTemplate<ITextFieldSchema>("prevent-drag-and-drop").bind({});
PreventDragAndDrop.args = {
	label: "Textfield",
	uiType: "text-field",
	customOptions: {
		preventDragAndDrop: true,
	},
};

export const Reset = ResetStoryTemplate<ITextFieldSchema>("text-reset").bind({});
Reset.args = {
	label: "Textfield",
	uiType: "text-field",
};

export const ResetWithDefaultValues = ResetStoryTemplate<ITextFieldSchema>("text-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	label: "Textfield",
	uiType: "text-field",
	defaultValues: "This is the default value",
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
