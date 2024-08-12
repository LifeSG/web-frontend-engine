import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IL1Value, INestedMultiSelectSchema, TL1OptionProps } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/NestedMultiSelect",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>NestedMultiSelect</Title>
					<p>This component provides a set of options for user to select multiple preferences.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("nested-multi-select"),
		disabled: {
			description: "Specifies if the input should be disabled",
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
			defaultValue: { summary: "false" },
		},
		enableSearch: {
			description: "When specified, it will allow a text base search for the items in the list",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: { summary: "false" },
		},
		hideNoResultsDisplay: {
			description: "If specified, the default no results display will not be rendered",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: { summary: "false" },
		},
		listStyleWidth: {
			description: "Style option: The width of the options. You can specify e.g. 100% or 12rem",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		mode: {
			description: "Determines if items are expanded or collapsed when the dropdown is opened",
			table: {
				type: {
					summary: `"default" | "expand" | "collapse"`,
				},
			},
			options: ["default", "expand", "collapse"],
			control: {
				type: "select",
			},
			defaultValue: { summary: "default" },
		},
		options: {
			description:
				"Specifies options that a user can choose from. Each option is in the form of `{ label: string, value: string, key: string }`, with optional `subItems`. Supports up to three levels of nesting.",
			table: {
				type: {
					summary: "TL1OptionProps",
				},
			},
			type: { name: "object", value: {} },
		},
		optionTruncationType: {
			description:
				"Specifies the trunction type of the options display. Truncated text will be replaced with ellipsis",
			table: {
				type: {
					summary: `"end" | "middle"`,
				},
			},
			options: ["end", "middle"],
			control: {
				type: "select",
			},
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		searchPlaceholder: {
			description: "The placeholder for the search field",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
	},
};
export default meta;

const options: TL1OptionProps[] = [
	{
		label: "Fruits",
		key: "fruits-key",
		subItems: [
			{
				label: "Berries",
				key: "berries-key",
				subItems: [
					{
						label: "Blueberry",
						value: "blueberry",
						key: "blueberry-key",
					},
					{
						label: "Raspberry",
						value: "raspberry",
						key: "raspberry-key",
					},
					{
						label: "Banana",
						value: "banana",
						key: "banana-key",
					},
				],
			},
			{
				label: "Melons",
				key: "melons-key",
				subItems: [
					{
						label: "Watermelon",
						value: "watermelon",
						key: "watermelon-key",
					},
					{
						label: "Honeydew",
						value: "honeydew",
						key: "honeydew-key",
					},
					{
						label: "Wintermelon",
						value: "wintermelon",
						key: "wintermelon-key",
					},
					{
						label: "Blueberry",
						value: "blueberry",
						key: "blueberry-key",
					},
				],
			},
			{
				label: "Durian",
				value: "durian",
				key: "durian-key",
			},
		],
	},
	{
		label: "Vegetables",
		key: "vegetable-key",
		subItems: [
			{
				label: "Cabbage",
				value: "cabbage",
				key: "cabbage-key",
			},
			{
				label: "Spinach",
				value: "spinach",
				key: "spinach-key",
			},
			{
				label: "Broccoli",
				value: "broccoli",
				key: "broccoli-key",
			},
		],
	},
];

export const Default = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-default").bind({});
Default.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
};

export const DefaultValue = DefaultStoryTemplate<INestedMultiSelectSchema, IL1Value>(
	"nested-multi-select-default-value"
).bind({});
DefaultValue.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	defaultValues: {
		"fruits-key": {
			"berries-key": {
				"blueberry-key": "blueberry",
			},
			"melons-key": {
				"watermelon-key": "watermelon",
			},
		},
	},
};

export const LabelCustomisation = DefaultStoryTemplate<INestedMultiSelectSchema, IL1Value>(
	"nested-multi-select-label-customisation"
).bind({});
LabelCustomisation.args = {
	uiType: "nested-multi-select",
	label: {
		mainLabel: "Fruits <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
	options: options,
};

DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "TNestedValues",
			},
		},
		type: { name: "object", value: {} },
	},
};

export const Disabled = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-disabled").bind({});
Disabled.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	disabled: true,
};

export const Searchable = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-select-searchable").bind({});
Searchable.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options,
	enableSearch: true,
};

export const CustomWidth = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-custom-width").bind({});
CustomWidth.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	listStyleWidth: "22rem",
};

export const Placeholder = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-placeholder").bind({});
Placeholder.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	placeholder: "Select your fruit",
};

export const WithValidation = DefaultStoryTemplate<INestedMultiSelectSchema>(
	"nested-multi-select-with-validation"
).bind({});
WithValidation.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-with-warning").bind({});
Warning.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
};

export const Reset = ResetStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-reset").bind({});
Reset.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	validation: [{ required: true }],
};

export const ResetWithDefaultValues = ResetStoryTemplate<INestedMultiSelectSchema, IL1Value>(
	"nested-multi-select-reset-default-value"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	defaultValues: {
		"fruits-key": {
			"berries-key": {
				"blueberry-key": "blueberry",
			},
			"melons-key": {
				"watermelon-key": "watermelon",
			},
		},
	},
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

export const Overrides = OverrideStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-overrides").bind({});
Overrides.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	overrides: {
		label: "Overridden",
		options: [{ label: "New field", value: "new", key: "new-key" }],
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;

export const SpecifyingMode = (args: INestedMultiSelectSchema) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						expanded: {
							...args,
							label: "With all (sub)categories expanded",
							mode: "expand",
						},
						collapsed: {
							...args,
							label: "With all (sub)categories collapsed",
							mode: "collapse",
						},
					},
				},
			},
		}}
	/>
);

SpecifyingMode.args = {
	uiType: "nested-multi-select",
	options: options,
};

export const WithSearch = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-with-search").bind({});
WithSearch.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	enableSearch: true,
};
