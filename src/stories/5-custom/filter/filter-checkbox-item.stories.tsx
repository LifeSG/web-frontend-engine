import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { useRef } from "react";
import { IFrontendEngineRef } from "../../../components";
import { IFilterSchema } from "../../../components/custom/filter/filter/types";
import {
	CommonCustomStoryProps,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	SUBMIT_BUTTON_SCHEMA,
} from "../../common";

export default {
	title: "Custom/Filter/FilterCheckbox",
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
		// WIll be implemented as a part of a differetn ticket.
		// validation: {
		// 	description:
		// 		"A set of config to ensure the value is acceptable before submission. For more info, refer to the <a href='/docs/form-validation-schema--required'>Validation Schema</a> stories",
		// 	table: {
		// 		type: {
		// 			summary: "array",
		// 		},
		// 	},
		// 	type: { name: "object", value: {} },
		// 	defaultValue: [],
		// },
		showIf: {
			description:
				"A set of conditions to render the field. For more info, refer to the <a href='../?path=/docs/form-conditional-rendering--filled'>Conditional Rendering</a> stories",
			table: {
				type: {
					summary: "array",
				},
			},
			type: { name: "object", value: {} },
			defaultValue: [],
		},
	},
} as Meta;

const Template = (id: string) =>
	(({ defaultValues, submitBtn, ...args }) => {
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
								...(submitBtn && { ...SUBMIT_BUTTON_SCHEMA }),
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
		);
	}) as Story<IFilterSchema & { defaultValues?: string[] | undefined; submitBtn?: boolean }>;

export const Default = Template("wrapper-default").bind({});
Default.args = {
	referenceKey: "filter",
	children: {
		filterItem1: {
			label: "With 5 or less items",
			referenceKey: "filter-checkbox",
			// validation: [{ required: true, errorMessage: "Choose at least one option" }],
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem2: {
			label: "With 5 or more items",
			referenceKey: "filter-checkbox",
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
			referenceKey: "filter-checkbox",
			collapsible: true,
			showDivider: true,
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem4: {
			label: "Non-Collapsible item",
			referenceKey: "filter-checkbox",
			collapsible: false,
			showDivider: false,
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem5: {
			label: "Collapsible item with divider",
			referenceKey: "filter-checkbox",
			collapsible: true,
			showDivider: true,
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
		filterItem6: {
			label: "Collapsible item with mobile divider",
			referenceKey: "filter-checkbox",
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

export const WithDefaultValues = Template("wrapper-default-values").bind({});
WithDefaultValues.args = {
	referenceKey: "filter",
	defaultValues: ["red", "orange"],
	children: {
		"wrapper-default-values": {
			label: "With 5 or more items",
			referenceKey: "filter-checkbox",
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
				{ label: "green", value: "green" },
				{ label: "orange", value: "orange" },
				{ label: "yellow", value: "yellow" },
				{ label: "black", value: "black" },
			],
		},
	},
};

WithDefaultValues.argTypes = {
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

export const Overrides = OverrideStoryTemplate<IFilterSchema>("filter-checkbox-overrides", false).bind({});
Overrides.args = {
	referenceKey: "filter",
	children: {
		filterCheckbox: {
			label: "Checkboxes",
			referenceKey: "filter-checkbox",
			options: [
				{ label: "red", value: "red" },
				{ label: "blue", value: "blue" },
			],
		},
	},
	overrides: {
		children: {
			filterCheckbox: {
				label: "Overridden",
				referenceKey: "filter-checkbox",
				options: [{ label: "new option", value: "new" }],
			},
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
