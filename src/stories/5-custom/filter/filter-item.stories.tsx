import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";
import { CommonCustomStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";

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
		children: {
			description: "Elements or string that is the descendant of this component",
			table: {
				type: {
					summary: "TFrontendEngineFieldSchema | string | (string | TFrontendEngineFieldSchema)[]",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
	},
};
export default meta;

const Template = (id: string) =>
	((args) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
						},
					},
				},
			}}
		/>
	)) as StoryFn<IFilterSchema>;

export const FilterItem = Template("wrapper-default").bind({});
FilterItem.args = {
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
		filterItem2: {
			label: "Non-Collapsible item",
			referenceKey: "filter-item",
			collapsible: false,
			showDivider: false,
			children: {
				text: {
					uiType: "text-bodysmall",
					children: "This is a non-collapsible item",
				},
			},
		},
		filterItem4: {
			label: "Collapsible item with divider",
			referenceKey: "filter-item",
			collapsible: true,
			showDivider: true,
			children: {
				text: {
					uiType: "text-bodysmall",
					children: "This is a collapsible item with divider",
				},
			},
		},
		filterItem5: {
			label: "Collapsible item with mobile divider",
			referenceKey: "filter-item",
			collapsible: true,
			showMobileDivider: true,
			showDivider: false,
			children: {
				text: {
					uiType: "text-bodysmall",
					children: "This is a collapsible item with divider in mobile only",
				},
			},
		},
	},
};

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
