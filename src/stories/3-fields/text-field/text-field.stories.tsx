import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ITextFieldSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/TextField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TextField</Title>
					<p>A form element that contains a label, input and error message.</p>
					<p>
						This component also inherits the{" "}
						<a
							href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement"
							target="_blank"
							rel="noopener noreferrer"
						>
							HTMLInputElement
						</a>{" "}
						attributes.
					</p>
					<ArgTypes of={Default} />
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
				defaultValue: { summary: "false" },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		customOptions: {
			description: `<ul>
				<li>\`preventCopyAndPaste\` prop accept \`boolean\` and also can be \`undefined\`. If value is true then it will prevent user from copy pasting.</li><br>
				<li>\`preventDragAndDrop\` prop accept \`boolean\` and also can be \`undefined\`. If value is true then it will prevent user from drag and drop.</li><br>
				<li>\`textTransform\` prop accept \`uppercase\` and also can be \`undefined\`. If value is set to \`uppercase\` then it will convert any user input to uppercase.<br>*Note: Unsetting \`textTransform\` at runtime does not revert existing input.</li><br>
				<li>\`addOn\` prop can be configured to display a label or icon at the start/end of the field. It is not included in the input</li><br>
				</ul>`,
			table: {
				type: {
					summary: `{preventCopyAndPaste?: boolean, preventCopyPaste?: boolean, textTransform?: "uppercase", addOn?: { type: "label", value: string, position?: "left" | "right" } | { type: "icon", value: string, position?: "left" | "right", color?: string }}`,
				},
			},
			defaultValue: { PreventCopyAndPaste: false, PreventDragAndDrop: false },
			control: { type: "object" },
		},
	},
};
export default meta;

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

export const LabelCustomisation = DefaultStoryTemplate<ITextFieldSchema>("text-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "text-field",
	label: {
		mainLabel: "Textfield <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
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

export const Warning = WarningStoryTemplate<ITextFieldSchema>("text-with-warning").bind({});
Warning.args = {
	label: "Textfield",
	uiType: "text-field",
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

export const Uppercase = DefaultStoryTemplate<ITextFieldSchema>("text-uppercase").bind({});
Uppercase.args = {
	label: "Textfield",
	uiType: "text-field",
	customOptions: {
		textTransform: "uppercase",
	},
};

export const AddOnIcon = DefaultStoryTemplate<ITextFieldSchema>("add-on-icon").bind({});
AddOnIcon.args = {
	label: "Textfield",
	uiType: "text-field",
	customOptions: {
		addOn: { type: "icon", icon: "MagnifierIcon", color: "#686868" },
	},
};

export const AddOnLabel = DefaultStoryTemplate<ITextFieldSchema>("add-on-label").bind({});
AddOnLabel.args = {
	label: "Textfield",
	uiType: "text-field",
	customOptions: {
		addOn: { type: "label", value: "$" },
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

export const Overrides = OverrideStoryTemplate<ITextFieldSchema>("text-overrides").bind({});
Overrides.args = {
	label: "Textfield",
	uiType: "text-field",
	overrides: {
		label: "Overridden",
		placeholder: "Overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
