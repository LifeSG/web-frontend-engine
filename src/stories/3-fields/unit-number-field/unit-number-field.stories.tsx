import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IUnitNumberFieldSchema } from "src/components/fields";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Field/UnitNumberField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>UnitNumberField</Title>
					<Description>A form element allows user enter unit number</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("unit-number-field"),
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
			description: "Specifies if the form element is interactable",
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
	)) as Story<IUnitNumberFieldSchema & { defaultValues?: string | undefined }>;

export const Default = Template("unit-number-default").bind({});
Default.args = {
	label: "Unit Number",
	uiType: "unit-number-field",
};

export const Disabled = Template("unit-number-disabled").bind({});
Disabled.args = {
	label: "Unit Number",
	uiType: "unit-number-field",
	disabled: true,
};

export const DefaultValue = Template("unit-number-default-value").bind({});
DefaultValue.args = {
	uiType: "unit-number-field",
	label: "Unit number with default value",
	defaultValues: "01-019",
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
		control: {
			type: "text",
		},
	},
};

export const Placeholder = Template("unit-number-placeholder").bind({});
Placeholder.args = {
	label: "Unit number with placeholder",
	uiType: "unit-number-field",
	placeholder: "03-045",
};

export const WithValidation = Template("unit-number-with-validation").bind({});
WithValidation.args = {
	uiType: "unit-number-field",
	label: "Unit number with validation",
	validation: [{ required: true }],
};
