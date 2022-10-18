import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ISelectSchema } from "src/components/fields/select/types";
import styled from "styled-components";
import { FrontendEngine } from "../../..";
import { ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/Select",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Select</Title>
					<Description>This component provides a set of options for user to select</Description>
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
			description: "Use <code>SELECT</code> to show this field",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: ["SELECT"],
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
					summary: "string[]",
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

const Template: Story<ISelectSchema> = (args) => <StyledForm data={{ fields: [args, SubmitButtonStorybook] }} />;

export const Default = Template.bind({});
Default.args = {
	type: "SELECT",
	id: "select-default",
	title: "Fruits",
	options: [1, 2, 3],
};

export const DefaultValue = () => (
	<StyledForm
		data={{
			fields: [
				{ type: "SELECT", id: "select-default-value", title: "Fruits", options: ["Apple", "Berry", "Cherry"] },
				SubmitButtonStorybook,
			],
			defaultValues: { "select-default-value": "Apple" },
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	type: "SELECT",
	id: "select-disasbled",
	title: "Fruits",
	options: ["Apple", "Berry", "Cherry"],
	disabled: true,
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
	type: "SELECT",
	id: "select-custom-width",
	title: "Fruits",
	options: ["Apple", "Berry", "Cherry"],
	listStyleWidth: "12rem",
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	type: "SELECT",
	id: "select-placeholder",
	title: "Fruits",
	options: ["Apple", "Berry", "Cherry"],
	placeholder: "Select your fruit",
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	type: "SELECT",
	id: "select-with-validation",
	title: "Fruits",
	options: ["Apple", "Berry", "Cherry"],
	validation: [{ required: true }],
};

const StyledForm = styled(FrontendEngine)`
	width: 300px;
`;
