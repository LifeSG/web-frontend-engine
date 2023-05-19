import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { IRadioButtonGroupSchema } from "../../../components/fields/radio-button/types";
import { CommonFieldStoryProps, DefaultStoryTemplate, ResetStoryTemplate } from "../../common";

export default {
	title: "Field/RadioButton/Default",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Radio Button</Title>
					<Description>This component provides a set of radio buttons for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("radio"),
		disabled: {
			description: "Specifies if the radio buttons should be disabled",
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
		options: {
			description:
				"A list of options that a user can choose from. Component <code>disabled</code> will take precedence over option <code>disabled</code>",
			table: {
				type: {
					summary: "{ label: string, value: string, disabled?: boolean }[]",
				},
			},
			type: { name: "object", value: {} },
		},
	},
} as Meta;

export const Default = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-default").bind({});
Default.args = {
	uiType: "radio",
	label: "Radio Button",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const DefaultValue = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-default-value").bind({});
DefaultValue.args = {
	uiType: "radio",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: "Apple",
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

export const DisabledOptions = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-disabled-options").bind({});
DisabledOptions.args = {
	uiType: "radio",
	label: "Radio Button",
	options: [
		{ label: "Apple", value: "Apple", disabled: true },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry", disabled: true },
	],
};

export const Disabled = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-disabled").bind({});
Disabled.args = {
	uiType: "radio",
	label: "Radio Button",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	disabled: true,
};

export const WithValidation = DefaultStoryTemplate<IRadioButtonGroupSchema>("radio-with-validation").bind({});
WithValidation.args = {
	uiType: "radio",
	label: "Radio Button",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	validation: [{ required: true }],
};

export const Reset = ResetStoryTemplate<IRadioButtonGroupSchema>("radio-reset").bind({});
Reset.args = {
	uiType: "radio",
	label: "Radio Button",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const ResetWithDefaultValues = ResetStoryTemplate<IRadioButtonGroupSchema>("radio-reset-default-values").bind(
	{}
);
ResetWithDefaultValues.args = {
	uiType: "radio",
	label: "Radio Button",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: "Apple",
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
		type: { name: "object", value: {} },
	},
};
