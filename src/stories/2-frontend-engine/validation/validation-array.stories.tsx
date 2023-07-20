import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import * as Yup from "yup";
import { IValidationComponentProps, ValidationComponent } from "./validation-component";

const meta: Meta = {
	title: "Form/Validation Schema/Arrays",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Validation Schema for Arrays</Title>
					<Description>These validation rules are applicable to `array` type only.</Description>
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

export const Length = Template.bind({});
Length.args = {
	type: "array",
	rule: { length: 5, errorMessage: "Must have exactly 5 items" },
	value: { name: [1, 2, 3, 4] },
};

export const MinItems = Template.bind({});
MinItems.args = {
	type: "array",
	rule: { min: 5, errorMessage: "Min 5 items" },
	value: { name: [1, 2, 3] },
};

export const MaxItems = Template.bind({});
MaxItems.args = {
	type: "array",
	rule: { max: 5, errorMessage: "Max 5 items" },
	value: { name: [1, 2, 3, 4, 5, 6] },
};

export const IncludesSingular = Template.bind({});
IncludesSingular.storyName = "Includes (Singular)";
IncludesSingular.args = {
	type: "array",
	rule: { includes: "hello world", errorMessage: "Must include `hello world`" },
	value: { name: ["lorem ipsum"] },
};

export const IncludesArray = Template.bind({});
IncludesArray.storyName = "Includes (Array)";
IncludesArray.args = {
	type: "array",
	rule: { includes: ["hello", "world"], errorMessage: "Must include `hello` and `world`" },
	value: { name: ["hello", "lorem", "ipsum"] },
};

export const ExcludesSingular = Template.bind({});
ExcludesSingular.storyName = "Excludes (Singular)";
ExcludesSingular.args = {
	type: "array",
	rule: { excludes: "hello world", errorMessage: "Must exclude be `hello world`" },
	value: { name: ["hello world"] },
};

export const ExcludesArray = Template.bind({});
ExcludesArray.storyName = "Excludes (Array)";
ExcludesArray.args = {
	type: "array",
	rule: { excludes: ["hello", "world"], errorMessage: "Must exclude `hello` and `world`" },
	value: { name: ["hello", "world", "lorem", "ipsum"] },
};

export const EqualsField = Template.bind({});
EqualsField.args = {
	type: "array",
	rule: { equalsField: "field2", errorMessage: "Both fields must match" },
	value: { name: ["Apple", "Berry"], field2: ["Apple"] },
	extraFields: { field2: { schema: Yup.array(), validationRules: [] } },
};
