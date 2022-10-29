import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IMultiSelectSchema } from "../../../components/fields/multi-select";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, StyledForm, SubmitButtonStorybook } from "../../common";

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
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("multi-select"),
		"multi-select-default": { table: { disable: true } },
		disabled: {
			description: "Specifies if the input should be disabled",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		options: {
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "IOption[]",
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

const Template: Story<Record<string, IMultiSelectSchema>> = (args) => (
	<StyledForm
		data={{
			fields: {
				...args,
				...SubmitButtonStorybook,
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"multi-select-default": {
		fieldType: "multi-select",
		label: "Fruits",
		options: [
			{ value: "1", label: "1" },
			{ value: "2", label: "2" },
			{ value: "3", label: "3" },
		],
	},
};

export const DefaultValue = () => (
	<StyledForm
		data={{
			fields: {
				"multi-select-default-value": {
					fieldType: "multi-select",
					label: "Fruits",
					options: [
						{ value: "Apple", label: "Apple" },
						{ value: "Berry", label: "Berry" },
						{ value: "Cherry", label: "Cherry" },
					],
				},
				...SubmitButtonStorybook,
			},
			defaultValues: {
				"multi-select-default-value": ["Apple", "Berry"],
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"multi-select-disabled": {
		fieldType: "multi-select",
		label: "Fruits",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
		disabled: true,
	},
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
	"multi-select-custom-width": {
		fieldType: "multi-select",
		label: "Fruits",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
		listStyleWidth: "12rem",
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"multi-select-placeholder": {
		fieldType: "multi-select",
		label: "Fruits",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
		placeholder: "Select your fruit",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"multi-select-with-validation": {
		fieldType: "multi-select",
		label: "Fruits",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
		validation: [{ required: true }],
	},
};
