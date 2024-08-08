import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { INumericFieldSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/NumericField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>NumericField</Title>
					<p>A form element that contains a label, input and error message</p>
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
				<li>\`addOn\` prop can be configured to display a label or icon at the start/end of the field. It is not included in the input</li><br>
				</ul>`,
			table: {
				type: {
					summary: `{preventCopyAndPaste?: boolean, preventCopyPaste?: boolean, addOn?: { type: "label", value: string, position?: "left" | "right" } | { type: "icon", value: string, position?: "left" | "right", color?: string }}`,
				},
			},
			defaultValue: { PreventCopyAndPaste: false, PreventDragAndDrop: false },
			control: { type: "object" },
		},
	},
};
export default meta;

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

export const LabelCustomisation = DefaultStoryTemplate<INumericFieldSchema>("numeric-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "numeric-field",
	label: {
		mainLabel: "Number <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
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

export const Warning = WarningStoryTemplate<INumericFieldSchema>("numeric-with-warning").bind({});
Warning.args = {
	label: "Number",
	uiType: "numeric-field",
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

export const AddOnIcon = DefaultStoryTemplate<INumericFieldSchema>("add-on-icon").bind({});
AddOnIcon.args = {
	label: "Number",
	uiType: "numeric-field",
	customOptions: {
		addOn: { type: "icon", icon: "StarFillIcon", color: "#686868", position: "right" },
	},
};

export const AddOnLabel = DefaultStoryTemplate<INumericFieldSchema>("add-on-label").bind({});
AddOnLabel.args = {
	label: "Number",
	uiType: "numeric-field",
	customOptions: {
		addOn: { type: "label", value: "kg", position: "right" },
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
