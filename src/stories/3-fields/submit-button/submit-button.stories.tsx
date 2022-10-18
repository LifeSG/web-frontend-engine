import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine, ISubmitButtonSchema } from "../../..";
import { ExcludeReactFormHookProps } from "../../common";

export default {
	title: "Field/SubmitButton",
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
		type: {
			description: "Use <code>SUBMIT</code> to show this field",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: ["SUBMIT"],
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
		styleType: {
			description: "The style type of the button",
			table: {
				type: {
					summary: "default | secondary | light | link",
				},
			},
			options: ["default", "secondary", "light", "link"],
			control: {
				type: "select",
			},
		},
		disabled: {
			description: "Specifies if the button is interactable",
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
	},
} as Meta;

const Template: Story<ISubmitButtonSchema> = (args) => <FrontendEngine data={{ fields: [args] }} />;

export const Default = Template.bind({});
Default.args = {
	type: "SUBMIT",
	id: "submit-button-default",
	title: "Submit",
};

export const Disabled = Template.bind({});
Disabled.args = {
	type: "SUBMIT",
	id: "submit-button-disabled",
	title: "Submit",
	disabled: true,
};

export const Styled = Template.bind({});
Styled.args = {
	type: "SUBMIT",
	id: "submit-button-styled",
	title: "Submit",
	styleType: "secondary",
};
