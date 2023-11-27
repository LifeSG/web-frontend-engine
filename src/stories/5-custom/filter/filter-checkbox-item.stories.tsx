import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
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
