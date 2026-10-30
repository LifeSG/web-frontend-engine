import { ArgTypes, Stories, Title } from "@storybook/addon-docs/blocks";
import { Meta } from "@storybook/react-webpack5";
import { THiddenFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Field/HiddenField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>HiddenField</Title>
					<p>A hidden form element that contains a value.</p>
					<ArgTypes of={Default} />
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
		value: {
			description:
				"The current value of the field. Works together with valueType and takes higher precedence than defaultValue. Can be used to override prefilled values / previously saved form values for conditional rendering / validation.",
			table: {
				type: {
					summary: "string | number | boolean",
				},
			},
			control: {
				type: "text",
			},
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<THiddenFieldSchema>("hidden-default").bind({});
Default.args = {
	uiType: "hidden-field",
};

export const DefaultValue = DefaultStoryTemplate<THiddenFieldSchema>("hidden-default-value").bind({});
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

export const NumericValue = DefaultStoryTemplate<THiddenFieldSchema, number>("hidden-numeric-value").bind({});
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

export const BooleanValue = DefaultStoryTemplate<THiddenFieldSchema, boolean>("hidden-boolean-value").bind({});
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

export const SchemaValue = DefaultStoryTemplate<THiddenFieldSchema, string>("schema-value").bind({});
SchemaValue.args = {
	uiType: "hidden-field",
	valueType: "string",
	value: "unchanged",
	defaultValues: "edited",
};
SchemaValue.argTypes = {
	defaultValues: {
		table: { disable: true },
	},
};

export const Validation = DefaultStoryTemplate<THiddenFieldSchema>("hidden-validation").bind({});
Validation.args = {
	uiType: "hidden-field",
	validation: [{ required: true }],
};
