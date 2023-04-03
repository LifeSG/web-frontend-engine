import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IMultiSelectSchema } from "../../../components/fields";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Field/MultiSelect",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>MultiSelect</Title>
					<Description>
						This component provides a set of options for user to select multiple preferences
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("multi-select"),
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
					summary: "{ label: string, value: string }[]",
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
							...SUBMIT_BUTTON_SCHEMA,
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
	)) as Story<IMultiSelectSchema & { defaultValues?: string[] | undefined }>;

export const Default = Template("multi-select-default").bind({});
Default.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "1", label: "1" },
		{ value: "2", label: "2" },
		{ value: "3", label: "3" },
	],
};

export const DefaultValue = Template("multi-select-default-value").bind({});
DefaultValue.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	defaultValues: ["Apple", "Berry"],
};
DefaultValue.argTypes = {
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

export const Disabled = Template("multi-select-disabled").bind({});
Disabled.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	disabled: true,
};

export const CustomWidth = Template("multi-select-custom-width").bind({});
CustomWidth.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	listStyleWidth: "12rem",
};

export const Placeholder = Template("multi-select-placeholder").bind({});
Placeholder.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	placeholder: "Select your fruit",
};

export const WithValidation = Template("multi-select-with-validation").bind({});
WithValidation.args = {
	uiType: "multi-select",
	label: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	validation: [{ required: true }],
};
