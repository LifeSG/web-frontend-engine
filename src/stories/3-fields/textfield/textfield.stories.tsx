import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine, ITextfieldSchema } from "../../..";
import { ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/TextField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TextField</Title>
					<Description>
						A form element that renders a multi-line textfield component with optional suggestion pills
					</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
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
			description: "Use <code>TEXTFIELD</code> to show this field",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: ["TEXTFIELD"],
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
		errorMessage: {
			description: "A message that describes the error/issue with the value of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		maxLength: {
			description: "A specified maximum length for the value of the form element",
			table: {
				type: {
					summary: "number",
				},
			},
			control: {
				type: "number",
			},
		},
	},
} as Meta;

const Template: Story<ITextfieldSchema> = (args) => (
	<FrontendEngine
		id="frontendEngine"
		validationMode="onSubmit"
		data={{
			fields: [args, SubmitButtonStorybook],
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	id: "textfield-default",
	title: "Textfield",
	type: "TEXT",
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	id: "textfield-with-validation",
	title: "Textfield with Validation",
	type: "TEXT",
	validation: [{ required: true }],
};
