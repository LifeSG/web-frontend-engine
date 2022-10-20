import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import styled from "styled-components";
import { FrontendEngine, ISelectSchema, Select } from "../../..";
import { ExcludeReactFormHookProps } from "../../common";

const ExcludeDefaultProps = {
	type: { table: { disable: true } },
	id: { table: { disable: true } },
	title: { table: { disable: true } },
	options: { table: { disable: true } },
};

export default {
	title: "Field/Select",
	component: Select,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Select</Title>
					<Description>This component provides a set of options for use to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		...ExcludeDefaultProps,
		schema: {
			description:
				"Acual component props, it is same as the schema used to define the field through the JSON schema",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"schema.id": {
			description: "The unique identifier of the component",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"schema.title": {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"schema.disabled": {
			description: "Specifies if the input should be disabled",
		},
		"schema.options": {
			description: "A list of options that a user can choose from",
		},
		"schema.placeholder": {
			description: "Specifies the placeholder text",
		},
		"schema.listStyleWidth": {
			description: "Style option: The width of the options. You can specify e.g. 100% or 12rem",
		},
	},
} as Meta;

const Template: Story<ISelectSchema> = (args) => (
	<StyledForm
		id="frontendEngine"
		validationMode="onSubmit"
		data={{
			fields: [args],
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	type: "SELECT",
	id: "select-default",
	title: "Fruits",
	options: [1, 2, 3],
};

export const Disabled = Template.bind({});
Disabled.args = {
	type: "SELECT",
	id: "select-disasbled",
	title: "Fruits",
	options: ["Apple", "Berry", "Cherry"],
	disabled: true,
};

export const CustomPlaceholder = Template.bind({});
CustomPlaceholder.args = {
	type: "SELECT",
	id: "select-custom-placeholder",
	title: "Fruits",
	options: ["Apple", "Berry", "Cherry"],
	placeholder: "Select your fruit",
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
	type: "SELECT",
	id: "select-custom-width",
	title: "Fruits",
	options: ["Apple", "Berry", "Cherry"],
	listStyleWidth: "12rem",
};

const StyledForm = styled(FrontendEngine)`
	width: 300px;
`;
