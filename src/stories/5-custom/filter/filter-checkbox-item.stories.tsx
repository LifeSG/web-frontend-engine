import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../common";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";

export default {
	title: "Custom/Filter/Fields",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Filter</Title>
					<Description>This component acts as a wrapper for filter component</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		label: { table: { disable: true } },
		referenceKey: {
			description: "Actual HTML element type to render the component as",
			table: {
				type: {
					summary: "filter",
				},
			},
			type: { name: "string", required: true },
			options: ["filter"],
			control: {
				type: "select",
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
	},
} as Meta;

const TemplateFilterItemCheckbox = (id: string) =>
	(({ defaultValues, ...args }) => (
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
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as Story<IFilterSchema & { defaultValues?: string[] | undefined }>; // TODO: should update type

export const FilterCheckBoxItem = TemplateFilterItemCheckbox("filterItem1").bind({});
FilterCheckBoxItem.args = {
	defaultValues: ["red"],
	referenceKey: "filter",
	children: {
		filterItem1: {
			label: "Filter Item 1",
			referenceKey: "filter-item-checkbox",
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
			validation: [{ required: true }],
		},
		filterItem2: {
			label: "Filter Item 2",
			referenceKey: "filter-item",
			children: {
				name: {
					uiType: "text-field",
					label: "Name",
				},
			},
		},
	},
};
