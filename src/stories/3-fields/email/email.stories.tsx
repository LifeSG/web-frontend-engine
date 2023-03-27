import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { IEmailSchema } from "../../../components/fields";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/Email",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Email</Title>
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
		...CommonFieldStoryProps("email"),
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
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
	},
} as Meta;

const Template: Story<Record<string, IEmailSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	"email-default": {
		label: "Email",
		uiType: "email",
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"email-default-value": {
					label: "Email",
					uiType: "email",
				},
				...SubmitButtonStorybook,
			},
			defaultValues: {
				"email-default-value": "default@domain.tld",
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"email-disabled": {
		label: "Email",
		uiType: "email",
		disabled: true,
	},
};

export const CustomErrorMessage = Template.bind({});
CustomErrorMessage.args = {
	"email-email-error": {
		label: "Email",
		uiType: "email",
		validation: [{ email: true, errorMessage: "Please use a valid email" }],
	},
};

export const MaxLength = Template.bind({});
MaxLength.args = {
	"textfield-maxlength": {
		label: "Email",
		uiType: "email",
		validation: [{ max: 5 }],
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"email-placeholder": {
		label: "Email",
		uiType: "email",
		placeholder: "Enter an email",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"email-with-validation": {
		label: "Email",
		uiType: "email",
		validation: [{ required: true }],
	},
};
