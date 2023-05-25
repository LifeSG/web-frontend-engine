import { InputRangeProp } from "@lifesg/react-design-system";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IRangeSelectSchema } from "../../../components/fields";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

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

const Template = (id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
							...(args.validation.length > 0 ? SUBMIT_BUTTON_SCHEMA : {}),
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
	)) as Story<IRangeSelectSchema & { defaultValues?: InputRangeProp<string> | undefined }>;

export const Default = Template("range-select-default").bind({});
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

export const DefaultValue = Template("range-select-default-value").bind({});
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

export const Disabled = Template("range-select-disabled").bind({});
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

export const Placeholder = Template("range-select-placeholder").bind({});
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

export const WithValidation = Template("range-select-with-validation").bind({});
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
