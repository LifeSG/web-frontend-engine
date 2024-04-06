import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IHiddenFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Field/HiddenField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>HiddenField</Title>
					<Description>A hidden form element that contains a value.</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("hidden-field"),
		columns: { table: { disable: true } },
		label: { table: { disable: true } },
		validation: { table: { disable: true } },
		valueType: {
			description:
				"Defines the primitive data type of the value. This affects how the field will be validated and how other fields can be conditionally rendered based on this field's value.",
			table: {
				type: {
					summary: "string | number | boolean",
				},
				defaultValue: { summary: "string" },
			},
			type: { name: "string" },
			options: ["string", "number", "boolean"],
			control: {
				type: "select",
			},
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<IHiddenFieldSchema>("hidden-default").bind({});
Default.args = {
	uiType: "hidden-field",
};

export const DefaultValue = DefaultStoryTemplate<IHiddenFieldSchema>("hidden-default-value").bind({});
DefaultValue.args = {
	uiType: "hidden-field",
	defaultValues: "This is the default value",
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};

export const NumericValue = DefaultStoryTemplate<IHiddenFieldSchema, number>("hidden-numeric-value").bind({});
NumericValue.args = {
	uiType: "hidden-field",
	valueType: "number",
	defaultValues: 1,
};
NumericValue.argTypes = {
	defaultValues: {
		table: { disable: true },
	},
};

export const BooleanValue = DefaultStoryTemplate<IHiddenFieldSchema, boolean>("hidden-boolean-value").bind({});
BooleanValue.args = {
	uiType: "hidden-field",
	valueType: "boolean",
	defaultValues: true,
};
BooleanValue.argTypes = {
	defaultValues: {
		table: { disable: true },
	},
};

export const Validation = DefaultStoryTemplate<IHiddenFieldSchema>("hidden-validation").bind({});
Validation.args = {
	uiType: "hidden-field",
	validation: [{ required: true }],
};
