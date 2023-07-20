import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IUnitNumberFieldSchema } from "src/components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";

const meta: Meta = {
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
};
export default meta;

export const Default = DefaultStoryTemplate<IUnitNumberFieldSchema>("unit-number-default").bind({});
Default.args = {
	label: "Unit Number",
	uiType: "unit-number-field",
};

export const Disabled = DefaultStoryTemplate<IUnitNumberFieldSchema>("unit-number-disabled").bind({});
Disabled.args = {
	label: "Unit Number",
	uiType: "unit-number-field",
	disabled: true,
};

export const DefaultValue = DefaultStoryTemplate<IUnitNumberFieldSchema>("unit-number-default-value").bind({});
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
	},
};

export const Placeholder = DefaultStoryTemplate<IUnitNumberFieldSchema>("unit-number-placeholder").bind({});
Placeholder.args = {
	label: "Unit number with placeholder",
	uiType: "unit-number-field",
	placeholder: "03-045",
};

export const CustomErrorMessage = DefaultStoryTemplate<IUnitNumberFieldSchema>("unit-number-custom-error").bind({});
CustomErrorMessage.args = {
	label: "Unit number with custom error",
	uiType: "unit-number-field",
	validation: [{ unitNumberFormat: true, errorMessage: "Please enter a valid unit number" }],
};

export const WithValidation = DefaultStoryTemplate<IUnitNumberFieldSchema>("unit-number-with-validation").bind({});
WithValidation.args = {
	label: "Unit number with validation",
	uiType: "unit-number-field",
	validation: [{ required: true }],
};

export const Reset = ResetStoryTemplate<IUnitNumberFieldSchema>("unit-number-reset").bind({});
Reset.args = {
	label: "Unit Number",
	uiType: "unit-number-field",
};

export const ResetWithDefaultValues = ResetStoryTemplate<IUnitNumberFieldSchema>(
	"unit-number-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	label: "Unit Number",
	uiType: "unit-number-field",
	defaultValues: "01-019",
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};

export const Overrides = OverrideStoryTemplate<IUnitNumberFieldSchema>("unit-number-overrides").bind({});
Overrides.args = {
	label: "Unit Number",
	uiType: "unit-number-field",
	overrides: {
		label: "Overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
