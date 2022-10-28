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
					<Title>Select</Title>
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
		select: { table: { disable: true } },
		displaySize: {
			description: "Specifies the display size of the checkbox",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: ["default", "small"],
			control: {
				type: "select",
			},
			defaultValue: "default",
		},
		checked: {
			description: "Specifies if the checkbox should be checked",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		disabled: {
			description: "Specifies if the checkbox should be disabled",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		options: {
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "IOption[]",
				},
			},
			type: { name: "object", value: {} },
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
	},
} as Meta;

const Template: Story<Record<string, ICheckboxGroupSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	"default-checkbox": {
		fieldType: "checkbox",
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
					fieldType: "checkbox",
					label: "Fruits",
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
					],
				},
				...SubmitButtonStorybook,
			},
			defaultValues: { "checkbox-default-value": [{ label: "Apple", value: "Apple" }] },
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };
