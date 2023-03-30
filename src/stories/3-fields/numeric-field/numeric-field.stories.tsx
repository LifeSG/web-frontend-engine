import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { INumericFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

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

const Template = (id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
							...SUBMIT_BUTTON_SCHEMA,
						},
					},
				},
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as Story<INumericFieldSchema & { defaultValues?: number | undefined }>;

export const Default = Template("numeric-default").bind({});
Default.args = {
	label: "Number",
	uiType: "numeric-field",
};

export const DefaultValue = Template("numeric-default-value").bind({});
DefaultValue.args = {
	label: "Number",
	uiType: "numeric-field",
	defaultValues: 1,
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "number",
			},
		},
		type: { name: "object", value: {} },
	},
};

export const Disabled = Template("numeric-disabled").bind({});
Disabled.args = {
	label: "Number",
	uiType: "numeric-field",
	disabled: true,
};

export const MaxLength = Template("numeric-maxlength").bind({});
MaxLength.args = {
	label: "Number",
	uiType: "numeric-field",
	maxLength: 2,
};

export const Placeholder = Template("numeric-placeholder").bind({});
Placeholder.args = {
	label: "Number",
	uiType: "numeric-field",
	placeholder: "Enter a number",
};

export const WithValidation = Template("numeric-with-validation").bind({});
WithValidation.args = {
	label: "Number",
	uiType: "numeric-field",
	validation: [{ required: true }],
};
