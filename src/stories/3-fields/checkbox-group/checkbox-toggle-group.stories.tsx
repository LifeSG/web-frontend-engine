import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { TCheckboxGroupSchema } from "../../../components/fields/checkbox-group";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/Checkbox/Toggle",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Checkbox - Toggle</Title>
					<p>This component provides a set of toggles for user to select.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("checkbox"),
		disabled: {
			description: "Specifies if the checkbox should be disabled",
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
			description:
				"<div>A custom options on which styling to use for rendering the toggle group.</div><ul><li>`styleType` prop accept either `default` or `toggle` and also can be `undefined`.If set to `toggle` will render toggle button, else render default checkboxes.</li><li>`indicator` show/hide checkbox icon, `false` by default.</li><li>`border` show/hide border,`true` by default.</li><li>`layoutType` render toggle buttons horizontally or vertically, `horizontal` by default.</li></ul>",
			table: {
				type: {
					summary: `{styleType: "toggle", indicator?: boolean, border?: boolean, layoutType?: "horizontal" | "vertical"}`,
				},
			},
			type: { name: "object", value: {} },
		},
		options: {
			description:
				"A list of options that a user can choose from. Component <code>disabled</code> will take precedence over option <code>disabled</code>. If any of the provide options has none set to true and if the user select that option, all other options get deselected.<br/><br/>Specify <code>children</code> to display a sublabel or nested fields associated with an option.",
			table: {
				type: {
					summary:
						"{label: string, value: string, disabled?: boolean, none?: boolean; children?: Record<string, TFrontendEngineFieldSchema>}[]",
				},
			},
			type: { name: "object", value: {} },
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-default").bind({});
Default.args = {
	uiType: "checkbox",
	label: "Toggle",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const DefaultValue = DefaultStoryTemplate<TCheckboxGroupSchema, string[]>("checkbox-default-value").bind({});
DefaultValue.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: ["Apple", "Berry"],
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string[]",
			},
		},
		type: { name: "object", value: {} },
	},
};

export const LabelCustomisation = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "checkbox",
	label: {
		mainLabel: "Fruits <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const DisabledOptions = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-disabled-options").bind({});
DisabledOptions.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple", disabled: true },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry", disabled: true },
	],
};

export const Disabled = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-disabled").bind({});
Disabled.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	disabled: true,
};

export const WithValidation = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-with-validation").bind({});
WithValidation.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<TCheckboxGroupSchema>("checkbox-with-warning").bind({});
Warning.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const NoneOption = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-default").bind({});
NoneOption.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "None", value: "deselect", none: true },
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const WithIndicator = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-default").bind({});
WithIndicator.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
		indicator: true,
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const VerticalLayout = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-default-vertical").bind({});
VerticalLayout.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
		indicator: true,
		layoutType: "vertical",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const WithoutBorder = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-default").bind({});
WithoutBorder.args = {
	uiType: "checkbox",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
		border: false,
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const NestedFields = DefaultStoryTemplate<TCheckboxGroupSchema>("checkbox-nested").bind({});
NestedFields.args = {
	uiType: "checkbox",
	label: "Select a reason",
	customOptions: {
		styleType: "toggle",
		indicator: true,
	},
	options: [
		{
			label: "Others",
			value: "Others",
			children: {
				wrapper: {
					uiType: "div",
					style: { padding: "1rem" },
					showIf: [{ "checkbox-nested": [{ filled: true }, { includes: ["Others"] }] }],
					children: {
						otherInput: {
							uiType: "textarea",
							label: "",
							validation: [{ required: true }, { max: 100 }],
						},
					},
				},
			},
		},
	],
};

export const Reset = ResetStoryTemplate<TCheckboxGroupSchema>("checkbox-reset").bind({});
Reset.args = {
	uiType: "checkbox",
	label: "Checkbox",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const ResetWithDefaultValues = ResetStoryTemplate<TCheckboxGroupSchema, string[]>(
	"checkbox-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "checkbox",
	label: "Checkbox",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: ["Apple", "Berry"],
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string[]",
			},
		},
		type: { name: "object", value: {} },
	},
};

export const Overrides = OverrideStoryTemplate<TCheckboxGroupSchema>("checkbox-overrides").bind({});
Overrides.args = {
	uiType: "checkbox",
	label: "Checkbox",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	overrides: {
		label: "Overridden",
		options: [{ label: "New field", value: "new" }],
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
