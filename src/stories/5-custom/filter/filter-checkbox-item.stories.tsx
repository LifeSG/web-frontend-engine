import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { CommonCustomStoryProps, FrontendEngine } from "../../common";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";

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
	},
} as Meta;

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
	)) as Story<IFilterSchema>;

export const FilterCheckBoxItem = Template("wrapper-default").bind({});
FilterCheckBoxItem.args = {
	referenceKey: "filter",
	children: {
		filterItem1: {
			label: "With 5 or less items",
			referenceKey: "filter-item-checkbox",
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem2: {
			label: "With 5 or more items",
			referenceKey: "filter-item-checkbox",
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
				{ label: "blue", value: "blue" },
				{ label: "blue", value: "blue" },
				{ label: "blue", value: "blue" },
				{ label: "blue", value: "blue" },
			],
		},
	},
};
