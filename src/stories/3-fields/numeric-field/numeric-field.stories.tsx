import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { INumericFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/NumericField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>NumericField</Title>
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
		...CommonFieldStoryProps("numeric-field"),
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

const Template: Story<Record<string, INumericFieldSchema>> = (args) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						...args,
						...SubmitButtonStorybook,
					},
				},
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"numeric-default": {
		label: "Number",
		uiType: "numeric-field",
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						"numeric-default-value": {
							label: "Number",
							uiType: "numeric-field",
						},
						...SubmitButtonStorybook,
					},
				},
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
		uiType: "numeric-field",
		disabled: true,
	},
};

export const MaxLength = Template.bind({});
MaxLength.args = {
	"numeric-maxlength": {
		label: "Number",
		uiType: "numeric-field",
		maxLength: 2,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"numeric-placeholder": {
		label: "Number",
		uiType: "numeric-field",
		placeholder: "Enter a number",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"numeric-with-validation": {
		label: "Number",
		uiType: "numeric-field",
		validation: [{ required: true }],
	},
};
