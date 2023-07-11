import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { INumericFieldSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";

export default {
	title: "Field/NumericField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>NumericField</Title>
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
		...CommonFieldStoryProps("numeric-field"),
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

export const Default = DefaultStoryTemplate<INumericFieldSchema>("numeric-default").bind({});
Default.args = {
	label: "Number",
	uiType: "numeric-field",
};

export const DefaultValue = DefaultStoryTemplate<INumericFieldSchema, number>("numeric-default-value").bind({});
DefaultValue.args = {
	label: "Number",
	uiType: "numeric-field",
	defaultValues: 1,
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "number",
			},
		},
	},
};

export const Disabled = DefaultStoryTemplate<INumericFieldSchema>("numeric-disabled").bind({});
Disabled.args = {
	label: "Number",
	uiType: "numeric-field",
	disabled: true,
};

export const MaxLength = DefaultStoryTemplate<INumericFieldSchema>("numeric-maxlength").bind({});
MaxLength.args = {
	label: "Number",
	uiType: "numeric-field",
	maxLength: 2,
};

export const Placeholder = DefaultStoryTemplate<INumericFieldSchema>("numeric-placeholder").bind({});
Placeholder.args = {
	label: "Number",
	uiType: "numeric-field",
	placeholder: "Enter a number",
};

export const WithValidation = DefaultStoryTemplate<INumericFieldSchema>("numeric-with-validation").bind({});
WithValidation.args = {
	label: "Number",
	uiType: "numeric-field",
	validation: [{ required: true }],
};

export const PreventCopyAndPaste = DefaultStoryTemplate<INumericFieldSchema>("prevent-copy-and-paste").bind({});
PreventCopyAndPaste.args = {
	label: "Number",
	uiType: "numeric-field",
	customOptions: {
		preventCopyAndPaste: true,
	},
};

export const PreventDragAndDrop = DefaultStoryTemplate<INumericFieldSchema>("prevent-drag-and-drop").bind({});
PreventDragAndDrop.args = {
	label: "Number",
	uiType: "numeric-field",
	customOptions: {
		preventDragAndDrop: true,
	},
};
export const Reset = ResetStoryTemplate<INumericFieldSchema>("numeric-reset").bind({});
Reset.args = {
	label: "Number",
	uiType: "numeric-field",
};

export const ResetWithDefaultValues = ResetStoryTemplate<INumericFieldSchema, number>(
	"numeric-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	label: "Number",
	uiType: "numeric-field",
	defaultValues: 1,
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "number",
			},
		},
	},
};

export const Overrides = OverrideStoryTemplate<INumericFieldSchema>("numeric-overrides").bind({});
Overrides.args = {
	label: "Number",
	uiType: "numeric-field",
	overrides: {
		label: "Overridden",
		placeholder: "Overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
