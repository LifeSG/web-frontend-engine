import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { INumberSchema } from "../../../components/fields";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/Number",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Number</Title>
					<Description>A form element that contains a label, input and error message</Description>
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
		...CommonFieldStoryProps("number"),
		number: { table: { disable: true } },
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
		disabled: {
			description: "Specifies if the textfield is interactable",
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

const Template: Story<Record<string, INumberSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	number: {
		label: "Number",
		fieldType: "number",
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"number-default-value": {
					label: "Number",
					fieldType: "number",
				},
				...SubmitButtonStorybook,
			},
			defaultValues: {
				"number-default-value": 1,
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"number-disabled": {
		label: "Number",
		fieldType: "number",
		disabled: true,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"number-placeholder": {
		label: "Number",
		fieldType: "number",
		placeholder: "Enter a number",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"number-with-validation": {
		label: "Number",
		fieldType: "number",
		validation: [{ required: true }],
	},
};
