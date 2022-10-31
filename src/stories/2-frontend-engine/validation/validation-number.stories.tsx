import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IValidationComponentProps, ValidationComponent } from "./validation-component";

export default {
	title: "Form/Validation Schema/Numbers",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Validation Schema for Numbers</Title>
					<Description>These validation rules are applicable to `number` type only.</Description>
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
