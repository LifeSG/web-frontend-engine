import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { INumberSchema } from "../../../components/fields";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/Numeric",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Numeric</Title>
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
		...CommonFieldStoryProps("numeric"),
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
	"numeric-default": {
		label: "Number",
		fieldType: "numeric",
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"numeric-default-value": {
					label: "Number",
					fieldType: "numeric",
				},
				...SubmitButtonStorybook,
			},
			defaultValues: {
				"numeric-default-value": 1,
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"numeric-disabled": {
		label: "Number",
		fieldType: "numeric",
		disabled: true,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"numeric-placeholder": {
		label: "Number",
		fieldType: "numeric",
		placeholder: "Enter a number",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"numeric-with-validation": {
		label: "Number",
		fieldType: "numeric",
		validation: [{ required: true }],
	},
};
