import { Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import * as Yup from "yup";
import { IValidationComponentProps, ValidationComponent } from "./validation-component";

const meta: Meta = {
	title: "Form/Validation Schema/Numbers",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Validation Schema for Numbers</Title>
					<p>These validation rules are applicable to `number` type only.</p>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
			source: {
				code: null,
			},
		},
	},
	argTypes: {
		type: {
			table: { disable: true },
		},
	},
};
export default meta;

const Template: StoryFn<IValidationComponentProps> = (args) => (
	<ValidationComponent type={args.type} rule={args.rule} value={args.value} />
);

export const MinValue = Template.bind({});
MinValue.args = {
	type: "number",
	rule: { min: 5, errorMessage: "Min 5" },
	value: { name: 4 },
};

export const MaxValue = Template.bind({});
MaxValue.args = {
	type: "number",
	rule: { max: 5, errorMessage: "Max 5" },
	value: { name: 6 },
};

export const LessThan = Template.bind({});
LessThan.args = {
	type: "number",
	rule: { lessThan: 5, errorMessage: "Less than 5" },
	value: { name: 6 },
};

export const MoreThan = Template.bind({});
MoreThan.args = {
	type: "number",
	rule: { min: 5, errorMessage: "More than 5" },
	value: { name: 4 },
};

export const Positive = Template.bind({});
Positive.args = {
	type: "number",
	rule: { positive: true, errorMessage: "Only positive values" },
	value: { name: -6 },
};

export const Negative = Template.bind({});
Negative.args = {
	type: "number",
	rule: { negative: true, errorMessage: "Only negative values" },
	value: { name: 6 },
};

export const Integer = Template.bind({});
Integer.args = {
	type: "number",
	rule: { integer: true, errorMessage: "Must be integer" },
	value: { name: 1.5 },
};

export const EqualsField = Template.bind({});
EqualsField.args = {
	type: "number",
	rule: { equalsField: "field2", errorMessage: "Both fields must match" },
	value: { name: 10, field2: 11 },
	extraFields: { field2: { schema: Yup.number(), validationRules: [] } },
};
