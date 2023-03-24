import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { ICheckboxGroupSchema } from "../../../components/fields/checkbox-group";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/Checkbox",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Checkbox</Title>
					<Description>This component provides a set of checkboxes for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("checkbox"),
		displaySize: {
			description: "Specifies the display size of the checkbox",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "default" },
			},
			options: ["default", "small"],
			control: {
				type: "select",
			},
		},
		disabled: {
			description: "Specifies if the checkbox should be disabled",
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
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "{label: string, value: string}[]",
				},
			},
			type: { name: "object", value: {} },
		},
	},
} as Meta;

const Template: Story<Record<string, ICheckboxGroupSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	"checkbox-default": {
		uiType: "checkbox",
		label: "Checkbox",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"checkbox-default-value": {
					uiType: "checkbox",
					label: "Fruits",
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
					],
				},
				...SubmitButtonStorybook,
			},
			defaultValues: { "checkbox-default-value": ["Apple", "Berry"] },
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"checkbox-disabled": {
		uiType: "checkbox",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		disabled: true,
	},
};

export const CustomSize = Template.bind({});
CustomSize.args = {
	"checkbox-custom-size": {
		uiType: "checkbox",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		displaySize: "small",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"checkbox-with-validation": {
		uiType: "checkbox",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		validation: [{ required: true }],
	},
};
