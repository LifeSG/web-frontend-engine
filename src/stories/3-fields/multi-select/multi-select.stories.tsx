import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import styled from "styled-components";
import { FrontendEngine } from "../../..";
import { IMultiSelectSchema } from "../../../components/fields/multi-select";
import { ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

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
		type: {
			description: "Use <code>MULTISELECT</code> to show this field",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: ["MULTISELECT"],
			control: {
				type: "select",
			},
		},
		id: {
			description: "The unique identifier of the component",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			control: {
				type: "text",
			},
		},
		title: {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
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

const Template: Story<IMultiSelectSchema> = (args) => (
	<StyledForm
		id="frontendEngine"
		validationMode="onSubmit"
		data={{
			fields: [args, SubmitButtonStorybook],
		}}
		defaultValues={{
			"multiselect-default-value": [
				{ value: "Apple", label: "Apple" },
				{ value: "Berry", label: "Berry" },
			],
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	type: "MULTISELECT",
	id: "multiselect-default",
	title: "Fruits",
	options: [
		{ value: 1, label: "1" },
		{ value: 2, label: "2" },
		{ value: 3, label: "3" },
	],
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
	type: "MULTISELECT",
	id: "multiselect-default-value",
	title: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
};

export const Disabled = Template.bind({});
Disabled.args = {
	type: "MULTISELECT",
	id: "multiselect-disasbled",
	title: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	disabled: true,
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
	type: "MULTISELECT",
	id: "multiselect-custom-width",
	title: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	listStyleWidth: "12rem",
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	type: "MULTISELECT",
	id: "multiselect-placeholder",
	title: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	placeholder: "Select your fruit",
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	type: "MULTISELECT",
	id: "multiselect-with-validation",
	title: "Fruits",
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
	validation: [{ required: true }],
};

const StyledForm = styled(FrontendEngine)`
	width: 300px;
`;
