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
	title: "Field/RadioButton/Default",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Radio Button</Title>
					<p>This component provides a set of radio buttons for user to select.</p>
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
		options: {
			description:
				"A list of options that a user can choose from. Component <code>disabled</code> will take precedence over option <code>disabled</code>",
			table: {
				type: {
					summary: "{ label: string, value: string, disabled?: boolean }[]",
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
	options: [
		{ label: "<a href='#'>Apple with a link</a>", value: "Apple" },
		{ label: "<strong>Bolded Berry</strong>", value: "Berry" },
		{ label: "<em>Italicised Cherry</em>", value: "Cherry" },
	],
};

export const WithValidation = DefaultStoryTemplate<TRadioButtonGroupSchema>("radio-with-validation").bind({});
WithValidation.args = {
	uiType: "radio",
	label: "Radio Button",
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
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const Reset = ResetStoryTemplate<TRadioButtonGroupSchema>("radio-reset").bind({});
Reset.args = {
	uiType: "radio",
	label: "Radio Button",
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
