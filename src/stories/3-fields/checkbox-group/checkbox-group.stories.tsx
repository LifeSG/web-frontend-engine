import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { ICheckboxGroupSchema } from "../../../components/fields/checkbox-group";
import { CommonFieldStoryProps, DefaultStoryTemplate, ResetStoryTemplate } from "../../common";

export default {
	title: "Field/Checkbox/Default",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Checkbox</Title>
					<Description>This component provides a set of checkboxes for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("checkbox"),
		displaySize: {
			description: "Specifies the display size of the checkbox",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "default" },
			},
			options: ["default", "small"],
			control: {
				type: "select",
			},
		},
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
		options: {
			description:
				"A list of options that a user can choose from. Component <code>disabled</code> will take precedence over option <code>disabled</code>",
			table: {
				type: {
					summary: "{label: string, value: string, disabled?: boolean}[]",
				},
			},
			type: { name: "object", value: {} },
		},
	},
} as Meta;

export const Default = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-default").bind({});
Default.args = {
	uiType: "checkbox",
	label: "Checkbox",
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
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	disabled: true,
};

export const CustomSize = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-custom-size").bind({});
CustomSize.args = {
	uiType: "checkbox",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	displaySize: "small",
};

export const WithValidation = DefaultStoryTemplate<ICheckboxGroupSchema>("checkbox-with-validation").bind({});
WithValidation.args = {
	uiType: "checkbox",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	validation: [{ required: true }],
};

export const Reset = ResetStoryTemplate<ICheckboxGroupSchema>("checkbox-reset").bind({});
Reset.args = {
	uiType: "checkbox",
	label: "Checkbox",
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
