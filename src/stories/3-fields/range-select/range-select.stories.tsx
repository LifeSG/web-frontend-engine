import { InputRangeProp } from "@lifesg/react-design-system/input-range-select";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { IRangeSelectSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";

export default {
	title: "Field/RangeSelect",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Range Select</Title>
					<Description>This component provides a set of options for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("range-select"),
		disabled: {
			description: "Specifies if the input should be disabled",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		options: {
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "{ from: { label: string, value: string }[], to: { label: string, value: string }[] }",
				},
			},
			type: { name: "object", value: {} },
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		listStyleWidth: {
			description: "Style option: The width of the options. You can specify e.g. 100% or 12rem",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
	},
} as Meta;

export const Default = DefaultStoryTemplate<IRangeSelectSchema>("range-select-default").bind({});
Default.args = {
	uiType: "range-select",
	label: "Directions",
	options: {
		from: [
			{ label: "North", value: "North" },
			{ label: "East", value: "East" },
		],
		to: [
			{ label: "South", value: "South" },
			{ label: "West", value: "West" },
		],
	},
};

export const DefaultValue = DefaultStoryTemplate<IRangeSelectSchema, InputRangeProp<string>>(
	"range-select-default-value"
).bind({});
DefaultValue.args = {
	uiType: "range-select",
	label: "Directions",
	options: {
		from: [
			{ label: "North", value: "North" },
			{ label: "East", value: "East" },
		],
		to: [
			{ label: "South", value: "South" },
			{ label: "West", value: "West" },
		],
	},
	defaultValues: {
		from: "North",
		to: "South",
	},
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
		control: {
			type: "text",
		},
	},
};

export const Disabled = DefaultStoryTemplate<IRangeSelectSchema>("range-select-disabled").bind({});
Disabled.args = {
	uiType: "range-select",
	label: "Directions",
	options: {
		from: [
			{ label: "North", value: "North" },
			{ label: "East", value: "East" },
		],
		to: [
			{ label: "South", value: "South" },
			{ label: "West", value: "West" },
		],
	},
	disabled: true,
};

export const Placeholder = DefaultStoryTemplate<IRangeSelectSchema>("range-select-placeholder").bind({});
Placeholder.args = {
	uiType: "range-select",
	label: "Directions",
	options: {
		from: [
			{ label: "North", value: "North" },
			{ label: "East", value: "East" },
		],
		to: [
			{ label: "South", value: "South" },
			{ label: "West", value: "West" },
		],
	},
	placeholders: {
		from: "Select to direction",
		to: "Select from direction",
	},
};

export const Search = DefaultStoryTemplate<IRangeSelectSchema>("range-select-search").bind({});
Search.args = {
	uiType: "range-select",
	label: "Fruits",
	options: {
		from: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
			{ label: "Dates", value: "Dates" },
			{ label: "Orange", value: "Orange" },
		],
		to: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
			{ label: "Dates", value: "Dates" },
			{ label: "Orange", value: "Orange" },
		],
	},
	enableSearch: true,
};

export const WithValidation = DefaultStoryTemplate<IRangeSelectSchema, InputRangeProp<string>>(
	"range-select-with-validation"
).bind({});
WithValidation.args = {
	uiType: "range-select",
	label: "Directions",
	options: {
		from: [
			{ label: "North", value: "North" },
			{ label: "East", value: "East" },
		],
		to: [
			{ label: "South", value: "South" },
			{ label: "West", value: "West" },
		],
	},
	defaultValues: {
		from: "",
		to: "",
	},
	validation: [{ required: true }],
};

export const Reset = ResetStoryTemplate<IRangeSelectSchema, InputRangeProp<string>>("range-select-reset").bind({});
Reset.args = {
	uiType: "range-select",
	label: "Directions",
	options: {
		from: [
			{ label: "North", value: "North" },
			{ label: "East", value: "East" },
		],
		to: [
			{ label: "South", value: "South" },
			{ label: "West", value: "West" },
		],
	},
};

export const ResetWithDefaultValues = ResetStoryTemplate<IRangeSelectSchema, InputRangeProp<string>>(
	"range-select-reset-default-value"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "range-select",
	label: "Directions",
	options: {
		from: [
			{ label: "North", value: "North" },
			{ label: "East", value: "East" },
		],
		to: [
			{ label: "South", value: "South" },
			{ label: "West", value: "West" },
		],
	},
	defaultValues: {
		from: "North",
		to: "South",
	},
};

ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "{ from: string, to: string }",
			},
		},
		type: { name: "object", value: {} },
	},
};

export const Overrides = OverrideStoryTemplate<IRangeSelectSchema>("range-select-overrides").bind({});
Overrides.args = {
	uiType: "range-select",
	label: "Directions",
	options: {
		from: [
			{ label: "North", value: "North" },
			{ label: "East", value: "East" },
		],
		to: [
			{ label: "South", value: "South" },
			{ label: "West", value: "West" },
		],
	},
	overrides: {
		label: "Overridden",
		options: {
			from: [{ label: "New", value: "new" }],
			to: [{ label: "New", value: "new" }],
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
