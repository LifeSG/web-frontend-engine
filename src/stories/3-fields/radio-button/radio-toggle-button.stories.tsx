import { ArgTypes, Stories, Title } from "@storybook/addon-docs/blocks";
import { Meta } from "@storybook/react-webpack5";
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
				'<div>A custom options on which styling to use for rendering the toggle group.</div><ul><li>`styleType` prop accept either `default` or `toggle`. If set to `toggle` will render toggle button, else render default radio buttons.</li><li>`indicator` show/hide radio icon, `false` by default.</li><li>`border` show/hide border, `true` by default.</li><li>`layoutType` render radio buttons horizontally or vertically (`"horizontal"` by default).</li><li>`allowDeselection` clicking a selected option deselects it (value becomes null), `false` by default.</li><li>`layoutColumns` controls how many toggle buttons appear per row using CSS grid — accepts a number or responsive object `{ mobile?, tablet?, desktop? }`.</li><li>`minItemWidth` sets a fixed minimum item width in pixels — accepts a number or responsive object `{ mobile?, tablet?, desktop? }`.</li><li>`stretch` when true, items stretch to fill the row using CSS auto-fill grid.</li></ul>',
			table: {
				type: {
					summary: `{styleType: "toggle", indicator?: boolean, border?: boolean, layoutType?: "horizontal" | "vertical", allowDeselection?: boolean, layoutColumns?: number | { mobile?: number, tablet?: number, desktop?: number }, minItemWidth?: number | { mobile?: number, tablet?: number, desktop?: number }, stretch?: boolean}`,
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
						"{label: string, value: string, disabled?: boolean; children?: Record<string, TFrontendEngineFieldSchema> }[]; subLabel?: string}",
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

export const OptionsWithSubLabel = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-options-with-sub-label").bind(
	{}
);
OptionsWithSubLabel.args = {
	uiType: "radio",
	label: {
		mainLabel: "Fruits",
	},
	customOptions: {
		styleType: "toggle",
	},
	options: [
		{ value: "Apple", label: "Apple", subLabel: "Keeps the <strong>doctor</strong> away" },
		{ value: "Berry", label: "Berry", subLabel: "<i>Berry</i> nutritious, good for you" },
		{ value: "Cherry", label: "Cherry", subLabel: "Pick<br>The cherry on top" },
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

export const AllowDeselection = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-allow-deselection").bind({});
AllowDeselection.args = {
	uiType: "radio",
	label: "Select a fruit (click again to deselect)",
	customOptions: {
		styleType: "toggle",
		allowDeselection: true,
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const AllowDeselectionFalse = DefaultStoryTemplate<TRadioButtonGroupSchema>(
	"radio-allow-deselection-false"
).bind({});
AllowDeselectionFalse.args = {
	uiType: "radio",
	label: "Select a fruit (clicking selected option has no effect — allowDeselection is false)",
	customOptions: {
		styleType: "toggle",
		allowDeselection: false,
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: "Apple",
};

export const AllowDeselectionWithNestedFields = DefaultStoryTemplate<TRadioButtonGroupSchema>(
	"radio-allow-deselection-nested"
).bind({});
AllowDeselectionWithNestedFields.args = {
	uiType: "radio",
	label: "Select a reason (deselect to clear nested field)",
	customOptions: {
		styleType: "toggle",
		allowDeselection: true,
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
					showIf: [{ "radio-allow-deselection-nested": [{ equals: "Others" }] }],
					children: {
						otherInput: {
							uiType: "textarea",
							label: "Please specify",
							validation: [{ required: true }, { max: 100 }],
						},
					},
				},
			},
		},
		{ label: "Not applicable", value: "NA" },
	],
};

export const AllowDeselectionWithRequiredValidation = DefaultStoryTemplate<TRadioButtonGroupSchema>(
	"radio-allow-deselection-required"
).bind({});
AllowDeselectionWithRequiredValidation.args = {
	uiType: "radio",
	label: "Select a fruit (required — deselecting triggers validation error)",
	customOptions: {
		styleType: "toggle",
		allowDeselection: true,
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	validation: [{ required: true, errorMessage: "Please select an option" }],
	defaultValues: "Apple",
};

export const AllowDeselectionWithDefault = DefaultStoryTemplate<TRadioButtonGroupSchema>(
	"radio-allow-deselection-default"
).bind({});
AllowDeselectionWithDefault.args = {
	uiType: "radio",
	label: "Select a fruit (has default, click to deselect)",
	customOptions: {
		styleType: "toggle",
		allowDeselection: true,
	},
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: "Apple",
};

export const MinItemWidth = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-min-item-width").bind({});
MinItemWidth.args = {
	uiType: "radio",
	label: "Fixed item width (200px each)",
	customOptions: { styleType: "toggle", minItemWidth: 200 },
	options: [
		{ label: "Option A", value: "a" },
		{ label: "Option B", value: "b" },
		{ label: "Option C", value: "c" },
		{ label: "Option D", value: "d" },
	],
};

export const LayoutColumns = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-layout-columns").bind({});
LayoutColumns.args = {
	uiType: "radio",
	label: "Select an option (2 per row, not stretched)",
	customOptions: {
		styleType: "toggle",
		layoutColumns: 2,
	},
	options: [
		{ label: "Option A", value: "a" },
		{ label: "Option B", value: "b" },
		{ label: "Option C", value: "c" },
		{ label: "Option D", value: "d" },
	],
};

export const LayoutColumnsResponsive = DefaultStoryTemplate<TRadioButtonGroupSchema>(
	"radio-layout-columns-responsive"
).bind({});
LayoutColumnsResponsive.args = {
	uiType: "radio",
	label: "Responsive columns (1 on mobile, 3 on desktop, not stretched)",
	customOptions: {
		styleType: "toggle",
		layoutColumns: { mobile: 1, desktop: 3 },
	},
	options: [
		{ label: "Option A", value: "a" },
		{ label: "Option B", value: "b" },
		{ label: "Option C", value: "c" },
		{ label: "Option D", value: "d" },
		{ label: "Option E", value: "e" },
		{ label: "Option F", value: "f" },
	],
};

export const Stretch = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-stretch").bind({});
Stretch.args = {
	uiType: "radio",
	label: "Stretch to fill row (auto-fill grid)",
	customOptions: { styleType: "toggle", stretch: true },
	options: [
		{ label: "Option A", value: "a" },
		{ label: "Option B", value: "b" },
		{ label: "Option C", value: "c" },
		{ label: "Option D", value: "d" },
	],
};

export const LayoutColumnsWithStretch = DefaultStoryTemplate<TRadioButtonGroupSchema>(
	"radio-layout-columns-stretch"
).bind({});
LayoutColumnsWithStretch.args = {
	uiType: "radio",
	label: "2 columns, stretched (resize to see)",
	customOptions: { styleType: "toggle", layoutColumns: 2, stretch: true },
	options: [
		{ label: "Option A", value: "a" },
		{ label: "Option B", value: "b" },
		{ label: "Option C", value: "c" },
		{ label: "Option D", value: "d" },
		{ label: "Option E", value: "e" },
	],
};

export const LayoutColumnsResponsiveWithStretch = DefaultStoryTemplate<TRadioButtonGroupSchema>(
	"radio-layout-columns-responsive-stretch"
).bind({});
LayoutColumnsResponsiveWithStretch.args = {
	uiType: "radio",
	label: "Responsive columns with stretch (1 mobile, 2 tablet, 3 desktop)",
	customOptions: {
		styleType: "toggle",
		layoutColumns: { mobile: 1, tablet: 2, desktop: 3 },
		stretch: true,
	},
	options: [
		{ label: "Option A", value: "a" },
		{ label: "Option B", value: "b" },
		{ label: "Option C", value: "c" },
		{ label: "Option D", value: "d" },
		{ label: "Option E", value: "e" },
		{ label: "Option F", value: "f" },
	],
};
