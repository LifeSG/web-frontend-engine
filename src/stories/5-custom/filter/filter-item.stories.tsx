import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IFilterItemSchema } from "../../../components/custom/filter/filter-item/types";
import { CommonCustomStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";

const meta: Meta = {
	title: "Custom/Filter/Filter-Item",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Filter Item</Title>
					<p>Displays widgets under collapsible panels to filter data results.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("filter-item"),
		label: {
			description:
				'A name/description of the purpose of the element. Accepts a string for a default label, or an object with a main label and a hint displayed in a popover.\n\nAlso accepts an element schema for more customisation.  (See <a href="../?path=/story/custom-filter-filter-item--label-customisation-with-schema">Label Customisation With Schema</a>)',
			table: {
				type: {
					summary:
						"string | { mainLabel: string, hint?: { content: string | Record<string, TElementSchema>, zIndex?: number } }",
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
		expanded: {
			description:
				"Specifies if the contents are collapsed or expanded in desktop. This is not applicable in mobile.",
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
	},
};
export default meta;

const Template = (id: string, count = 1) =>
	(({ defaultValues, ...args }) => (
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
								},
							},
						},
					},
				},
				defaultValues,
			}}
		/>
	)) as StoryFn<IFilterItemSchema & { defaultValues?: Record<string, string> | undefined }>;

export const Default = Template("filter-item-default").bind({});
Default.args = {
	label: "Filter item",
	referenceKey: "filter-item",
	children: {
		text: {
			uiType: "text-body",
			children: "This is a filter item",
		},
	},
};

export const WithDefaultValues = Template("filter-item-default-values").bind({});
WithDefaultValues.args = {
	label: "Filter item",
	referenceKey: "filter-item",
	collapsible: false,
	children: {
		fruits: {
			uiType: "radio",
			label: "Fruits",
			options: [
				{ label: "Apple", value: "Apple" },
				{ label: "Berry", value: "Berry" },
				{ label: "Cherry", value: "Cherry" },
			],
		},
	},
	defaultValues: {
		fruits: "Apple",
	},
};
WithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the fields, this is declared outside `sections`",
	},
};

export const LabelCustomisation = Template("filter-item-label-customisation").bind({});
LabelCustomisation.args = {
	label: {
		mainLabel: "Filter item",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
	referenceKey: "filter-item",
	children: {
		text: {
			uiType: "text-body",
			children: "This is a filter item",
		},
	},
};

export const LabelCustomisationWithSchema = Template("filter-item-label-customisation-with-schema").bind({});
LabelCustomisationWithSchema.args = {
	label: {
		mainLabel: "Filter item",
		hint: {
			content: {
				wrapperSpan: {
					children: {
						titleInH3: {
							children: '<h3 style="margin-bottom:1rem">Common questions in h3</h3>',
							uiType: "text-h3",
							weight: "semibold",
						},
						anotherTitleInH4: {
							children: '<h4 style="margin-bottom:1rem">Common questions in h4</h4>',
							uiType: "text-h4",
							weight: "semibold",
						},
						bodyText: {
							children:
								'<p style="margin-bottom:1rem">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>',
							uiType: "text-body",
						},
						lists: {
							children: [
								{
									listItem: {
										children: {
											bodyText: {
												children: '<p style="margin-bottom:0.5rem">a bullet list </p>',
												uiType: "text-body",
											},
										},
										uiType: "list-item",
									},
									listItem2: {
										children: {
											"just a text": {
												children:
													'<span><strong>A description: </strong><a href="https://www.google.com" target="_blank" rel="noopener noreferrer">a link to google</span>',
												uiType: "text-body",
											},
										},
										uiType: "list-item",
									},
								},
							],
							uiType: "unordered-list",
						},
					},
					uiType: "div",
				},
			},
		},
	},
	referenceKey: "filter-item",
	children: {
		text: {
			uiType: "text-body",
			children: "This is a filter item",
		},
	},
};

export const Collapsible = Template("filter-item-expanded").bind({});
Collapsible.args = {
	label: "Filter item",
	referenceKey: "filter-item",
	collapsible: false,
	children: {
		text: {
			uiType: "text-body",
			children: "This is expanded by default",
		},
	},
};

export const Expanded = Template("filter-item-initial-expanded").bind({});
Expanded.args = {
	label: "Filter item",
	referenceKey: "filter-item",
	collapsible: true,
	expanded: true,
	children: {
		text: {
			uiType: "text-body",
			children: "This is expanded by default in desktop on page load",
		},
	},
};

export const HideDivider = Template("filter-item-divider", 2).bind({});
HideDivider.args = {
	label: "Filter item",
	referenceKey: "filter-item",
	showDivider: false,
	showMobileDivider: false,
	children: {
		text: {
			uiType: "text-body",
			children: "This is a filter item",
		},
	},
};

export const RevertOnClear = Template("filter-item-revert").bind({});
RevertOnClear.args = {
	label: "Filter item",
	referenceKey: "filter-item",
	collapsible: false,
	clearBehavior: "revert",
	children: {
		fruits: {
			uiType: "radio",
			label: "Fruits",
			options: [
				{ label: "Apple", value: "Apple" },
				{ label: "Berry", value: "Berry" },
				{ label: "Cherry", value: "Cherry" },
			],
		},
	},
	defaultValues: { fruits: "Apple" },
};
RevertOnClear.argTypes = WithDefaultValues.argTypes;

export const RetainOnClear = Template("filter-item-retain").bind({});
RetainOnClear.args = {
	label: "Filter item",
	referenceKey: "filter-item",
	collapsible: false,
	clearBehavior: "retain",
	children: {
		fruits: {
			uiType: "radio",
			label: "Fruits",
			options: [
				{ label: "Apple", value: "Apple" },
				{ label: "Berry", value: "Berry" },
				{ label: "Cherry", value: "Cherry" },
			],
		},
	},
	defaultValues: { fruits: "Apple" },
};
RetainOnClear.argTypes = WithDefaultValues.argTypes;

export const Overrides = OverrideStoryTemplate<IFilterSchema>("filter-item-overrides", false).bind({});
Overrides.args = {
	referenceKey: "filter",
	children: {
		filterItem1: {
			label: "Collapsible item",
			referenceKey: "filter-item",
			collapsible: true,
			showDivider: true,
			expanded: true,
			children: {
				text: {
					uiType: "text-body",
					children: "This is a collapsible item",
				},
			},
		},
	},
	overrides: {
		children: {
			filterItem1: {
				label: "Overridden item",
				expanded: false,
				children: {
					text: {
						children: "This is an overridden collapsible item",
					},
				},
			},
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
