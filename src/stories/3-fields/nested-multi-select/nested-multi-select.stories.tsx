import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IL1Option, INestedMultiSelectSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/NestedMultiSelect",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>NestedMultiSelect</Title>
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
		...CommonFieldStoryProps("nested-multi-select"),
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

const options: IL1Option[] = [
	{
		label: "Fruits",
		value: "fruits",
		subItems: [
			{
				label: "Berries",
				value: "berries",
				subItems: [
					{
						label: "Blueberry",
						value: "blueberry",
					},
					{
						label: "Raspberry",
						value: "raspberry",
					},
					{
						label: "Banana",
						value: "banana",
					},
				],
			},
			{
				label: "Melons",
				value: "melons",
				subItems: [
					{
						label: "Watermelon",
						value: "watermelon",
					},
					{
						label: "Honeydew",
						value: "honeydew",
					},
					{
						label: "Wintermelon",
						value: "wintermelon",
					},
				],
			},
			{
				label: "Durian",
				value: "durian",
			},
		],
	},
	{
		label: "Vegetables",
		value: "vegetables",
		subItems: [
			{
				label: "Cabbage",
				value: "cabbage",
			},
			{
				label: "Spinach",
				value: "spinach",
			},
			{
				label: "Broccoli",
				value: "broccoli",
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

export const DefaultValue = DefaultStoryTemplate<INestedMultiSelectSchema, string[]>(
	"nested-multi-select-default-value"
).bind({});
DefaultValue.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	defaultValues: ["blueberry", "durian"],
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

export const Disabled = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-disabled").bind({});
Disabled.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	disabled: true,
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

export const Reset = ResetStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-reset").bind({});
Reset.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	validation: [{ required: true }],
};

export const ResetWithDefaultValues = ResetStoryTemplate<INestedMultiSelectSchema, string[]>(
	"nested-multi-select-reset-default-value"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	options: options,
	defaultValues: ["blueberry", "durian"],
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
		options: [{ label: "New field", value: "new" }],
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
