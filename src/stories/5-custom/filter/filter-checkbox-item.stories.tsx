import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { CommonCustomStoryProps, FrontendEngine } from "../../common";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";
import { useRef } from "react";
import { IFrontendEngineRef } from "../../../components";

export default {
	title: "Custom/Filter/Filter-Checkbox",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Filter Checkbox</Title>
					<Description>Widget to select multiple options</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("filter-checkbox"),
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
			description: "A list of options that a user can choose from.",
			table: {
				type: {
					summary: "{label: string, value: string}[]",
				},
			},
			type: { name: "object", value: {} },
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
	},
} as Meta;

const Template = (id: string) =>
	((args) => {
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
					defaultValues: {
						[id]: ["red"],
					},
				}}
			/>
		);
	}) as Story<IFilterSchema>;

export const FilterCheckBoxItem = Template("wrapper-default").bind({});
FilterCheckBoxItem.args = {
	referenceKey: "filter",
	children: {
		filterItem1: {
			label: "With 5 or less items with validation",
			referenceKey: "filter-item-checkbox",
			validation: [{ required: true, errorMessage: "Choose at least one option" }],
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem2: {
			label: "With 5 or more items and default values",
			referenceKey: "filter-item-checkbox",
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
				{ label: "green", value: "green" },
				{ label: "orange", value: "orange" },
				{ label: "yellow", value: "yellow" },
				{ label: "black", value: "black" },
			],
		},
		filterItem3: {
			label: "Collapsible item",
			referenceKey: "filter-item-checkbox",
			collapsible: true,
			showDivider: true,
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem4: {
			label: "Non-Collapsible item",
			referenceKey: "filter-item-checkbox",
			collapsible: false,
			showDivider: false,
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem5: {
			label: "Collapsible item with divider",
			referenceKey: "filter-item-checkbox",
			collapsible: true,
			showDivider: true,
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem6: {
			label: "Collapsible item with mobile divider",
			referenceKey: "filter-item-checkbox",
			collapsible: true,
			showMobileDivider: true,
			showDivider: false,
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
	},
};
