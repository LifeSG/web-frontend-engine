import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IRadioButtonGroupSchema } from "../../../components/fields/radio-button/types";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/RadioButton/Toggle",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Radio Toggle Button</Title>
					<Description>This component provides a set of radio toggle buttons for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
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
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		customOptions: {
			description:
				"<div>A custom options on which styling to use for rendering the toggle group.</div><ul><li>`styleType` prop accept either `default` or `toggle` and also can be `undefined`.If set to `toggle` will render toggle button, else render default radio buttons.</li><li>`indicator` show/hide radio icon, `false` by default.</li><li>`border` show/hide border,`true` by default.</li></ul>",
			table: {
				type: {
					summary: `{styleType: "toggle", indicator?: boolean, border?: boolean}`,
				},
			},
			type: { name: "object", value: {} },
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

export const Default = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-default").bind({});
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

export const DefaultValue = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-default-value").bind({});
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

export const DisabledOptions = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-disabled-options").bind({});
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

export const Disabled = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-disabled").bind({});
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

export const WithValidation = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-with-validation").bind({});
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

export const WithIndicator = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-with-validation").bind({});
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

export const WithoutBorder = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-with-validation").bind({});
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

export const Reset = ResetStoryTemplate<IRadioButtonGroupSchema>("radio-reset").bind({});
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

export const ResetWithDefaultValues = ResetStoryTemplate<IRadioButtonGroupSchema>("radio-reset-default-values").bind(
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

export const Overrides = OverrideStoryTemplate<IRadioButtonGroupSchema>("radio-overrides").bind({});
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
