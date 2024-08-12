import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { CommonCustomStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";
import { useRef } from "react";
import { IFrontendEngineRef } from "../../../components";

const meta: Meta = {
	title: "Custom/Filter",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Filter</Title>
					<p>Displays widgets under collapsible panels to filter data results.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("filter"),
		label: {
			description: "A name/description of the purpose of the element used in desktop view",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		toggleFilterButtonLabel: {
			description: "Filter button label used in mobile view.",
			defaultValue: "Filters Mobile",
		},
		clearButtonDisabled: {
			description: "Toggle to disable the clear filters button",
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		children: {
			description:
				"Elements or string that is the descendant of this component. Only accepts FilterItem or FilterCheckbox.",
			table: {
				type: {
					summary:
						"IFilterItemSchema | IFilterItemCheckboxSchema | string | (string | IFilterItemSchema | IFilterItemCheckboxSchema)[]",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
	},
};
export default meta;
const Template =
	(id: string): StoryFn<IFilterSchema> =>
	(args) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const formRef = useRef<IFrontendEngineRef>(null);
		return (
			<FrontendEngine
				ref={formRef}
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
		);
	};

export const Default = Template("wrapper-default").bind({});
Default.args = {
	referenceKey: "filter",
	label: "Filters Desktop",
	toggleFilterButtonLabel: "Filters Mobile",
	children: {
		filterItem1: {
			label: "Search",
			referenceKey: "filter-item",
			children: {
				name: {
					label: "",
					uiType: "text-field",
					placeholder: "Enter keyword",
				},
			},
		},
	},
};

export const DisabledClearButton = Template("wrapper-default").bind({});
DisabledClearButton.args = {
	referenceKey: "filter",
	label: "Filters",
	toggleFilterButtonLabel: "Filters Mobile",
	clearButtonDisabled: true,
	children: {
		filterItem1: {
			label: "Search",
			referenceKey: "filter-item",
			children: {
				name: {
					label: "",
					uiType: "text-field",
					placeholder: "Enter keyword",
				},
			},
		},
	},
};

export const Overrides = OverrideStoryTemplate<IFilterSchema>("filter-overrides", false).bind({});
Overrides.args = {
	referenceKey: "filter",
	label: "Filters Desktop",
	toggleFilterButtonLabel: "Filters Mobile",
	children: {
		filterItem1: {
			label: "Search",
			referenceKey: "filter-item",
			collapsible: true,
			children: {
				name: {
					label: "",
					uiType: "text-field",
					placeholder: "Enter keyword",
				},
			},
		},
	},
	overrides: {
		label: "Overridden",
		toggleFilterButtonLabel: "Overridden",
		children: {
			filterItem1: {
				expanded: true,
			},
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
