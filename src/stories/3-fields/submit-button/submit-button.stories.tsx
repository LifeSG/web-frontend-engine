import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import { FrontendEngine, ISubmitButtonSchema, SubmitButton } from "../../..";
import { ExcludeReactFormHookProps } from "../../common";

const ExcludeDefaultProps = {
	type: { table: { disable: true } },
	id: { table: { disable: true } },
	title: { table: { disable: true } },
	onClick: { table: { disable: true } },
};

export default {
	title: "Field/SubmitButton",
	component: SubmitButton,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>SubmitButton</Title>
					<Description>The primary call to action component</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement)
						attributes.
					</Description>
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
			description: "The label of the SubmitButton",
			table: {
				type: {
					summary: "React.ReactNode | string",
				},
			},
		},
		"schema.styleType": {
			description: "The style type of the button",
			table: {
				type: {
					summary: "default | secondary | light | link",
				},
			},
		},
		"schema.disabled": {
			description: "Specifies if the button is interactable",
		},
	},
} as Meta;

const Template: Story<ISubmitButtonSchema> = (args) => (
	<FrontendEngine
		id="frontendEngine"
		validationMode="onSubmit"
		data={{
			fields: [args],
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	type: "SUBMIT",
	id: "submitbutton-default",
	title: "Submit",
	onClick: () => alert("Submitted"),
};

export const Disabled = Template.bind({});
Disabled.args = {
	type: "SUBMIT",
	id: "submitbutton-disabled",
	title: "Submit (disabled)",
	disabled: true,
};

export const Styled = Template.bind({});
Styled.args = {
	type: "SUBMIT",
	id: "submitbutton-default",
	title: "Submit",
	onClick: () => alert("Submitted"),
	styleType: "light",
};
