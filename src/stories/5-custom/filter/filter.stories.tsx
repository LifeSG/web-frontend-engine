import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { CommonCustomStoryProps, FrontendEngine } from "../../common";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";
import { useRef } from "react";
import { IFrontendEngineRef } from "../../../components";

export default {
	title: "Custom/Filter",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Filter</Title>
					<Description>Displays widgets under collapsible panels to filter data results</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("filter"),
		toggleFilterButtonLabel: {
			description: "Toggle to display label for filter button",
			control: {
				type: "text",
			},
			defaultValue: "true",
		},
		children: {
			description:
				"Elements or string that is the descendant of this component. Only accepts FilterItem or FilterItemCheckbox.",
			table: {
				type: {
					summary:
						"IFilterItemSchema | IFilterItemCheckboxSchema | string | (string | IFilterItemSchema | IFilterItemCheckboxSchema)[]",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
	},
} as Meta;
const Template = (id: string) =>
	((args) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const formRef = useRef<IFrontendEngineRef>(null);
		args.onClear = () => {
			for (const key in formRef.current?.getValues()) {
				// FIXME - Temporary hacky fix until FEE has reset function
				formRef.current?.setValue(key, "");
			}
		};
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
	}) as Story<IFilterSchema>;

export const FilterWrapper = Template("wrapper-default").bind({});
FilterWrapper.args = {
	referenceKey: "filter",
	toggleFilterButtonLabel: "true",
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

export const FilterWrapperWithDisabledClear = Template("wrapper-default").bind({});
FilterWrapperWithDisabledClear.args = {
	referenceKey: "filter",
	toggleFilterButtonLabel: "true",
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
