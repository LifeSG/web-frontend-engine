import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IMultiSelectSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/MultiSelect",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>MultiSelect</Title>
					<Description>
						This component provides a set of options for user to select multiple preferences
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("multi-select"),
		disabled: {
			description: "Specifies if the input should be disabled",
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
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "{ label: string, value: string }[]",
				},
			},
			type: { name: "object", value: {} },
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		listStyleWidth: {
			description: "Style option: The width of the options. You can specify e.g. 100% or 12rem",
			table: {
				type: {
					summary: "string",
				},
			},
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<IMultiSelectSchema>("multi-select-default").bind({});
Default.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "1", label: "1" },
		{ value: "2", label: "2" },
		{ value: "3", label: "3" },
	],
};

export const DefaultValue = DefaultStoryTemplate<IMultiSelectSchema, string[]>("multi-select-default-value").bind({});
DefaultValue.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
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

export const LabelCustomisation = DefaultStoryTemplate<IMultiSelectSchema>("multi-select-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "multi-select",
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

export const Disabled = DefaultStoryTemplate<IMultiSelectSchema>("multi-select-disabled").bind({});
Disabled.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	disabled: true,
};

export const Searchable = DefaultStoryTemplate<IMultiSelectSchema>("multi-select-searchable").bind({});
Searchable.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "apple" },
		{ label: "Berry", value: "berry" },
		{ label: "Cherry", value: "cherry" },
	],
	enableSearch: true,
};

export const CustomWidth = DefaultStoryTemplate<IMultiSelectSchema>("multi-select-custom-width").bind({});
CustomWidth.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	listStyleWidth: "12rem",
};

export const Placeholder = DefaultStoryTemplate<IMultiSelectSchema>("multi-select-placeholder").bind({});
Placeholder.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	placeholder: "Select your fruit",
};

export const WithValidation = DefaultStoryTemplate<IMultiSelectSchema>("multi-select-with-validation").bind({});
WithValidation.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<IMultiSelectSchema>("multi-select-with-warning").bind({});
Warning.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
};

export const Reset = ResetStoryTemplate<IMultiSelectSchema>("multi-select-reset").bind({});
Reset.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
};

export const ResetWithDefaultValues = ResetStoryTemplate<IMultiSelectSchema, string[]>(
	"multi-select-reset-default-value"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
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

export const Overrides = OverrideStoryTemplate<IMultiSelectSchema>("multi-select-overrides").bind({});
Overrides.args = {
	uiType: "multi-select",
	label: "Fruits",
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
