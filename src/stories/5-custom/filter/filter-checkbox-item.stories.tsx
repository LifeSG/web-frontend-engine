import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IFilterCheckboxSchema } from "../../../components/custom/filter/filter-checkbox/types";
import {
	CommonCustomStoryProps,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	SUBMIT_BUTTON_SCHEMA,
} from "../../common";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";

const meta: Meta = {
	title: "Custom/Filter/FilterCheckbox",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Filter Checkbox</Title>
					<p>Widget to select multiple options.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("filter-checkbox"),
		label: {
			description: `A name/description of the purpose of the section which may include an optional hint displayed in a popover.<br>
				If string is provided, the entire label will be rendered.<br>
				If object is provided:
				<ul>
					<li>mainLabel: Primary text to display.</li>
					<li>hint.content: Displays an info icon and brings up the content as a popover on click. Accepts a string or schema for more customisation. (See <strong>Label Customisation With Schema</strong> story)</li>
				</ul>`,
			table: {
				type: {
					summary:
						"string | { mainLabel: string, hint?: { content: string | Record<string, TBlockElementSchema | TInlineElementSchema | TWrapperSchema>, zIndex?: number } }",
				},
			},
		},
		children: {
			description: "Elements or string that is the descendant of this component",
			table: {
				type: {
					summary: "TFrontendEngineFieldSchema | string | (string | TFrontendEngineFieldSchema)[]",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
		options: {
			description:
				"A list of options that a user can choose from. Supports nested options - parent options with nested children use 'key' for identification, while leaf options (without children) use 'value' and will submit values when selected. Parent options are used for grouping only.",
			table: {
				type: {
					summary: "Array<{label: string, key: string, options: IOption[]} | {label: string, value: string}>",
				},
			},
			type: { name: "object", value: {} },
		},
		clearBehavior: {
			description:
				"Action to update value on clicking clear button in filter, defaults to `clear` behaviour.<br>`clear` - Empties the value<br>`revert` - Revert to defaultValues<br>`retain` - Retain value",
			table: {
				type: {
					summary: "clear|revert|retain",
				},
			},
			control: {
				type: "select",
			},
			options: ["clear", "revert", "retain"],
		},
		collapsible: {
			description: "Specifies if the contents can be collapsed or expanded",
			control: {
				type: "boolean",
			},
			defaultValue: true,
		},
		showDivider: {
			description: "Specifies if header divider is visible in default mode",
			control: {
				type: "boolean",
			},
			defaultValue: true,
		},
		showMobileDivider: {
			description: "Specifies if divider is visible in mobile mode",
			control: {
				type: "boolean",
			},
			defaultValue: true,
		},
		showIf: {
			description:
				"A set of conditions to render the field. For more info, refer to the <a href='../?path=/docs/form-conditional-rendering-rules--filled'>Conditional Rendering</a> stories",
			table: {
				type: {
					summary: "array",
				},
			},
			type: { name: "object", value: {} },
			defaultValue: [],
		},
		expanded: {
			description:
				"Specifies if the contents are collapsed or expanded in desktop. This is not applicable in mobile.",
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		useToggleContentWidth: {
			description: "Changes the minimum width of the checkbox toggle to fit its content (on mobile)",
			table: {
				type: {
					summary: "boolean",
				},
			},
		},
	},
};
export default meta;

const Template = (id: string, count = 1) =>
	(({ defaultValues, ...args }) => {
		return (
			<FrontendEngine
				data={{
					sections: {
						section: {
							uiType: "section",
							children: {
								[id]: {
									referenceKey: "filter",
									children: {
										...Array(count)
											.fill("")
											.reduce(
												(schema, _, i) => ({
													...schema,
													[`${id}-${i}`]: args,
												}),
												{}
											),
										...SUBMIT_BUTTON_SCHEMA,
									},
								},
							},
						},
					},
					defaultValues,
				}}
			/>
		);
	}) as StoryFn<IFilterCheckboxSchema & { defaultValues?: Record<string, string[]> | undefined }>;

export const Default = Template("filter-checkbox-default").bind({});
Default.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	options: [
		{ label: "red", value: "red" },
		{ label: "blue", value: "blue" },
	],
};

export const MoreThan5Options = Template("filter-checkbox-long").bind({});
MoreThan5Options.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	collapsible: false,
	options: [
		{ label: "red", value: "red" },
		{ label: "blue", value: "blue" },
		{ label: "green", value: "green" },
		{ label: "orange", value: "orange" },
		{ label: "yellow", value: "yellow" },
		{ label: "black", value: "black" },
	],
};

export const WithNestedOptions6Levels = Template("filter-checkbox-nested-options-6-levels").bind({});
WithNestedOptions6Levels.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	collapsible: false,
	options: [
		{
			value: "antartica",
			label: "Antartica",
		},
		{
			key: "americas",
			label: "Americas",
			options: [
				{
					key: "usa",
					label: "USA",
					options: [
						{
							key: "california",
							label: "California",
							options: [
								{
									key: "los_angeles_county",
									label: "Los Angeles County",
									options: [
										{
											key: "los_angeles",
											label: "Los Angeles",
											options: [
												{
													value: "beverly_crest",
													label: "Beverly Crest",
												},
												{
													value: "hollywood",
													label: "Hollywood",
												},
												{
													value: "westchester",
													label: "Westchester",
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};

export const NestedOptionsWithViewMore = Template("filter-checkbox-nested-options-view-more").bind({});
NestedOptionsWithViewMore.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	collapsible: false,
	options: [
		{
			key: "food",
			label: "Food & Dining",
			options: [
				{
					key: "restaurants",
					label: "Restaurants",
					options: [
						{ value: "italian", label: "Italian" },
						{ value: "chinese", label: "Chinese" },
						{ value: "japanese", label: "Japanese" },
					],
				},
				{
					key: "fastfood",
					label: "Fast Food",
					options: [
						{ value: "burgers", label: "Burgers" },
						{ value: "pizza", label: "Pizza" },
					],
				},
				{ value: "cafes", label: "Cafes" },
			],
		},
		{
			key: "shopping",
			label: "Shopping",
			options: [
				{
					key: "clothing",
					label: "Clothing",
					options: [
						{ value: "mens", label: "Men's Wear" },
						{ value: "womens", label: "Women's Wear" },
						{ value: "kids", label: "Kids' Wear" },
					],
				},
				{ value: "electronics", label: "Electronics" },
				{ value: "books", label: "Books" },
			],
		},
		{
			key: "entertainment",
			label: "Entertainment",
			options: [
				{ value: "movies", label: "Movies" },
				{ value: "concerts", label: "Concerts" },
				{ value: "sports", label: "Sports" },
			],
		},
	],
};

export const WithDefaultValues = Template("filter-checkbox-default-values").bind({});
WithDefaultValues.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	collapsible: false,
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
	defaultValues: {
		"filter-checkbox-default-values-0": ["red"],
	},
};
WithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the fields, this is declared outside `sections`",
	},
};

export const LabelCustomisation = Template("filter-checkbox-label-customisation").bind({});
LabelCustomisation.args = {
	label: {
		mainLabel: "Filter item",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
	referenceKey: "filter-checkbox",
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
};

export const LabelCustomisationWithSchema = Template("filter-checkbox-label-customisation-with-schema").bind({});
LabelCustomisationWithSchema.args = {
	label: {
		mainLabel: "Filter item",
		hint: {
			content: {
				wrapper: {
					children: {
						heading: {
							uiType: "text-h3",
							weight: "semibold",
							children: "Heading",
							style: {
								marginBottom: "1rem",
							},
						},
						description: {
							uiType: "text-body",
							children:
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
							style: {
								marginBottom: "1rem",
							},
						},
						list: {
							children: [
								{
									listItem: {
										children: "A bullet list",
										uiType: "list-item",
										style: {
											marginBottom: "0.5rem",
										},
									},
									listItem2: {
										children:
											'<strong>A description: </strong><a href="https://www.google.com" target="_blank" rel="noopener noreferrer">a link to google</a>',
										uiType: "list-item",
									},
								},
							],
							uiType: "unordered-list",
							size: "BodySmall",
						},
					},
					uiType: "div",
				},
			},
		},
	},
	referenceKey: "filter-checkbox",
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
};

export const Collapsible = Template("filter-checkbox-collapsible").bind({});
Collapsible.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	collapsible: false,
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
};

export const Expanded = Template("filter-checkbox-initial-expanded").bind({});
Expanded.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	collapsible: true,
	expanded: true,
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
};

export const HideDivider = Template("filter-checkbox-divider", 2).bind({});
HideDivider.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	showDivider: false,
	showMobileDivider: false,
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
};

export const FormattedOptions = Template("filter-checkbox-formatted-options").bind({});
FormattedOptions.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	options: [
		{
			label: `<span style="display: flex; gap: 0.5rem; align-items: center;"><span style="display: block; background: red; height: 0.75rem; width: 0.75rem; border-radius: 50%;"></span>Red</span>`,
			value: "red",
		},
		{
			label: `<span style="display: flex; gap: 0.5rem; align-items: center;"><span style="display: block; background: blue; height: 0.75rem; width: 0.75rem; border-radius: 50%;"></span>Blue</span>`,
			value: "blue",
		},
	],
};

export const RevertOnClear = Template("filter-checkbox-revert").bind({});
RevertOnClear.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	collapsible: false,
	clearBehavior: "revert",
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
	defaultValues: { "filter-checkbox-revert-0": ["red"] },
};
RevertOnClear.argTypes = WithDefaultValues.argTypes;

export const RetainOnClear = Template("filter-checkbox-retain").bind({});
RetainOnClear.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	collapsible: false,
	clearBehavior: "retain",
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
	defaultValues: { "filter-checkbox-retain-0": ["red"] },
};
RetainOnClear.argTypes = WithDefaultValues.argTypes;

export const Overrides = OverrideStoryTemplate<IFilterSchema>("filter-checkbox-overrides", false).bind({});
Overrides.args = {
	referenceKey: "filter",
	children: {
		filterCheckbox: {
			label: "Checkboxes",
			referenceKey: "filter-checkbox",
			options: [
				{ label: "Red", value: "red" },
				{ label: "Blue", value: "blue" },
			],
		},
	},
	overrides: {
		children: {
			filterCheckbox: {
				label: "Overridden",
				referenceKey: "filter-checkbox",
				options: [{ label: "New option", value: "new" }],
				collapsible: true,
				expanded: true,
			},
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;

export const MobileContentWidth = Template("filter-checkbox-mobile-content-width").bind({});
MobileContentWidth.args = {
	label: "Filter checkbox",
	referenceKey: "filter-checkbox",
	options: [
		{ label: "Red", value: "red" },
		{ label: "Blue", value: "blue" },
	],
	useToggleContentWidth: true,
};
