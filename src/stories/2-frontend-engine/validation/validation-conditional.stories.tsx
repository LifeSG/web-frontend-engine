import * as Yup from "yup";
import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IValidationComponentProps, ValidationComponent } from "./validation-component";

const meta: Meta = {
	title: "Form/Validation Schema/Conditional",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Conditional Validation</Title>
					<Description>
						These validation schemas are only applicable if certain criterias are fulfilled.
					</Description>
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
	<ValidationComponent type={args.type} rule={args.rule} value={args.value} extraFields={args.extraFields} />
);

export const IfExactValue = Template.bind({});
IfExactValue.args = {
	type: "string",
	rule: {
		when: {
			field2: {
				is: "something",
				then: [
					{
						required: true,
						errorMessage: "Name is required when field2=something",
					},
				],
				otherwise: [
					{
						min: 5,
						errorMessage: "Name must have at least 5 characters when field2!=something",
					},
				],
			},
		},
	},
	value: { name: undefined, field2: "something" },
	extraFields: { field2: { schema: Yup.string(), validationRules: [] } },
};

export const SchemaAsCondition = Template.bind({});
SchemaAsCondition.args = {
	type: "string",
	rule: {
		when: {
			field2: {
				is: [{ filled: true }, { min: 3 }],
				then: [
					{
						required: true,
						errorMessage: "Name is required when field2 has at least 3 characters",
					},
				],
				otherwise: [
					{
						min: 5,
						errorMessage: "Name must have at least 5 characters when field2 is not filled",
					},
				],
			},
		},
	},
	value: { field2: "something" },
	extraFields: { field2: { schema: Yup.string(), validationRules: [] } },
};
