import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { ICheckboxGroupSchema } from "../../../components/fields/checkbox-group";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";

export default {
	title: "Field/Checkbox/Toggle",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Checkbox - Toggle</Title>
					<Description>This component provides a set of toggles for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
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
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		customOptions: {
			description:
				"<div>A custom options on which styling to use for rendering the toggle group.</div><ul><li>`styleType` prop accept either `default` or `toggle` and also can be `undefined`.If set to `toggle` will render toggle button, else render default checkboxes.</li><li>`indicator` show/hide checkbox icon, `false` by default.</li><li>`border` show/hide border,`true` by default.</li></ul>",
			table: {
				type: {
					summary: `{styleType: "toggle", indicator?: boolean, border?: boolean}`,
				},
			},
			type: { name: "object", value: {} },
		},
		options: {
			description:
				"A list of options that a user can choose from. Component <code>disabled</code> will take precedence over option <code>disabled</code>. If any of the provide options has none set to true and if the user select that option, all other options get deselected.",
			table: {
				type: {
					summary: "{label: string, value: string, disabled?: boolean, none?: boolean}[]",
				},
			},
			type: { name: "object", value: {} },
		},
	},
} as Meta;

export const Default = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-default").bind({});
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

export const DefaultValue = DefaultStoryTemplate<ICheckboxGroupSchema, string[]>("checkbox-default-value").bind({});
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

export const DisabledOptions = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-disabled-options").bind({});
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

export const Disabled = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-disabled").bind({});
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

export const WithValidation = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-with-validation").bind({});
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

export const NoneOption = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-default").bind({});
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

export const WithIndicator = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-default").bind({});
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

export const WithoutBorder = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-default").bind({});
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

export const Reset = ResetStoryTemplate<ICheckboxGroupSchema>("checkbox-reset").bind({});
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

export const ResetWithDefaultValues = ResetStoryTemplate<ICheckboxGroupSchema, string[]>(
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

export const Overrides = OverrideStoryTemplate<ICheckboxGroupSchema>("checkbox-overrides").bind({});
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
