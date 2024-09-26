import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { TRadioButtonGroupSchema } from "../../../components/fields/radio-button/types";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/RadioButton/Toggle",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Radio Toggle Button</Title>
					<p>This component provides a set of radio toggle buttons for user to select.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("radio"),
		disabled: {
			description: "Specifies if the radio buttons should be disabled",
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
				"<div>A custom options on which styling to use for rendering the toggle group.</div><ul><li>`styleType` prop accept either `default` or `toggle` and also can be `undefined`.If set to `toggle` will render toggle button, else render default radio buttons.</li><li>`indicator` show/hide radio icon, `false` by default.</li><li>`border` show/hide border,`true` by default.</li><li>`layoutType` render radio buttons horizontally or vertically, `horizontal` by default.</li></ul>",
			table: {
				type: {
					summary: `{styleType: "toggle", indicator?: boolean, border?: boolean, layoutType?: "horizontal" | "vertical"}`,
				},
			},
			type: { name: "object", value: {} },
		},
		options: {
			description:
				"A list of options that a user can choose from. Component <code>disabled</code> will take precedence over option <code>disabled</code>.<br/><br/>Specify <code>children</code> to display a sublabel or nested fields associated with an option.",
			table: {
				type: {
					summary:
						"{ label: string, value: string, disabled?: boolean; children?: Record<string, TFrontendEngineFieldSchema> }[]",
				},
			},
			type: { name: "object", value: {} },
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-default").bind({});
Default.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const DefaultValue = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-default-value").bind({});
DefaultValue.args = {
	uiType: "radio",
	label: "Fruits",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: "Apple",
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

export const LabelCustomisation = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "radio",
	label: {
		mainLabel: "Fruits <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
};

export const DisabledOptions = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-disabled-options").bind({});
DisabledOptions.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple", disabled: true },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry", disabled: true },
	],
};

export const Disabled = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-disabled").bind({});
Disabled.args = {
	uiType: "radio",
	label: "Radio Button",
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

export const FormattedOptions = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-formatted-options").bind({});
FormattedOptions.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{
			label: {
				description: { uiType: "span", children: "Apple with tooltip " },
				tooltip: {
					uiType: "popover",
					icon: "QuestionmarkCircleFillIcon",
					hint: { content: "Keeps the doctor away" },
				},
			},
			value: "Apple",
		},
		{ label: "<strong>Bolded Berry</strong>", value: "Berry" },
		{ label: "<em>Italicised Cherry</em>", value: "Cherry" },
	],
};

export const WithValidation = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-with-validation").bind({});
WithValidation.args = {
	uiType: "radio",
	label: "Radio Button",
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

export const Warning = WarningStoryTemplate<TRadioButtonGroupSchema>("radio-with-warning").bind({});
Warning.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const WithIndicator = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-with-validation").bind({});
WithIndicator.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "toggle",
		indicator: true,
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	validation: [{ required: true }],
};

export const VerticalLayout = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-with-validation-vertical").bind({});
VerticalLayout.args = {
	uiType: "radio",
	label: "Radio Button",
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
	validation: [{ required: true }],
};

export const WithoutBorder = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-with-validation").bind({});
WithoutBorder.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "toggle",
		border: false,
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	validation: [{ required: true }],
};

export const NestedFields = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-nested").bind({});
NestedFields.args = {
	uiType: "radio",
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
					showIf: [{ "radio-nested": [{ equals: "Others" }] }],
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

export const Reset = ResetStoryTemplate<TRadioButtonGroupSchema>("radio-reset").bind({});
Reset.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const ResetWithDefaultValues = ResetStoryTemplate<TRadioButtonGroupSchema>("radio-reset-default-values").bind(
	{}
);
ResetWithDefaultValues.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: "Apple",
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

export const Overrides = OverrideStoryTemplate<TRadioButtonGroupSchema>("radio-overrides").bind({});
Overrides.args = {
	uiType: "radio",
	label: "Radio Button",
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
