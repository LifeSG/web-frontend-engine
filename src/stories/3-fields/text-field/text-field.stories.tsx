import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { ITextFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Field/TextField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TextField</Title>
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
		...CommonFieldStoryProps("text-field"),
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

const Template: Story<Record<string, ITextFieldSchema>> = (args) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						...args,
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"text-default": {
		label: "Textfield",
		uiType: "text-field",
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						"text-default-value": {
							label: "Textfield",
							uiType: "text-field",
						},
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
			defaultValues: {
				"text-default-value": "This is the default value",
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"text-disabled": {
		label: "Textfield",
		uiType: "text-field",
		disabled: true,
	},
};

export const MaxLength = Template.bind({});
MaxLength.args = {
	"text-maxlength": {
		label: "Textfield",
		uiType: "text-field",
		validation: [{ max: 5 }],
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"text-placeholder": {
		label: "Textfield",
		uiType: "text-field",
		placeholder: "Enter text here",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"text-with-validation": {
		label: "Textfield",
		uiType: "text-field",
		validation: [{ required: true }],
	},
};
