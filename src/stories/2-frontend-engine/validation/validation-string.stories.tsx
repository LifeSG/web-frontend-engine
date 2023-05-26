import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import * as Yup from "yup";
import { IValidationComponentProps, ValidationComponent } from "./validation-component";

export default {
	title: "Form/Validation Schema/Strings",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Validation Schema for Strings</Title>
					<Description>These validation rules are applicable to `string` type only.</Description>
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
} as Meta;

const Template: Story<IValidationComponentProps> = (args) => (
	<ValidationComponent type={args.type} rule={args.rule} value={args.value} />
);

export const NoOfCharacters = Template.bind({});
NoOfCharacters.args = {
	type: "string",
	rule: { length: 10, errorMessage: "Must have 10 characters" },
	value: { name: "hello world" },
};

export const MinCharacters = Template.bind({});
MinCharacters.args = {
	type: "string",
	rule: { min: 5, errorMessage: "Min 5 characters" },
	value: { name: "a" },
};

export const MaxCharacters = Template.bind({});
MaxCharacters.args = {
	type: "string",
	rule: { max: 5, errorMessage: "Max 5 characters" },
	value: { name: "abcdef" },
};

export const Matches = Template.bind({});
Matches.args = {
	type: "string",
	rule: { matches: "/^(hello)/", errorMessage: "Need to begin with `hello`" },
	value: { name: "lorem ipsum" },
};

export const Email = Template.bind({});
Email.args = {
	type: "string",
	rule: { email: true, errorMessage: "Invalid email" },
	value: { name: "lorem ipsum" },
};

export const Url = Template.bind({});
Url.args = {
	type: "string",
	rule: { url: true, errorMessage: "Invalid url" },
	value: { name: "lorem ipsum" },
};

export const UUID = Template.bind({});
UUID.args = {
	type: "string",
	rule: { uuid: true, errorMessage: "Invalid uuid" },
	value: { name: "lorem ipsum" },
};

export const Uinfin = Template.bind({});
Uinfin.args = {
	type: "string",
	rule: { uinfin: true, errorMessage: "Invalid uinfin" },
	value: { name: "hello world" },
};

export const EqualsField = Template.bind({});
EqualsField.args = {
	type: "string",
	rule: { equalsField: "field2", errorMessage: "Both fields must match" },
	value: { name: "hello world", field2: "world" },
	extraFields: { field2: { schema: Yup.string(), validationRules: [] } },
};
