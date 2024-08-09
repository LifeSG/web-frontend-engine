import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IEmailFieldSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/EmailField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>EmailField</Title>
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

export const LabelCustomisation = DefaultStoryTemplate<IEmailFieldSchema>("email-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "email-field",
	label: {
		mainLabel: "Email <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
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

export const Warning = WarningStoryTemplate<IEmailFieldSchema>("email-with-warning").bind({});
Warning.args = {
	label: "Email",
	uiType: "email-field",
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
	label: "Email",
	uiType: "email-field",
	customOptions: {
		preventDragAndDrop: true,
	},
};

export const AddOnIcon = DefaultStoryTemplate<IEmailFieldSchema>("add-on-icon").bind({});
AddOnIcon.args = {
	label: "Email",
	uiType: "email-field",
	customOptions: {
		addOn: { type: "icon", icon: "PlusIcon", color: "#686868" },
	},
};

export const AddOnLabel = DefaultStoryTemplate<IEmailFieldSchema>("add-on-label").bind({});
AddOnLabel.args = {
	label: "Email",
	uiType: "email-field",
	customOptions: {
		addOn: { type: "label", value: "#" },
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

export const Overrides = OverrideStoryTemplate<IEmailFieldSchema>("email-overrides").bind({});
Overrides.args = {
	uiType: "email-field",
	label: "Email",
	overrides: {
		label: "Overridden",
		placeholder: "Overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
