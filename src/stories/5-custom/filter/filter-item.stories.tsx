import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
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
					<Description>Displays widgets under collapsible panels to filter data results</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("filter-item"),
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
			description: "Specifies if the contents are collapsed or expanded",
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
			children: "This is expanded by default on page load",
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
