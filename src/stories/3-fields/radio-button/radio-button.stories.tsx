import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { IRadioButtonGroupSchema } from "../../../components/fields/radio-button/types";
import { CommonFieldStoryProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/RadioButton",
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
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "{ label: string, value: string }[]",
				},
			},
			type: { name: "object", value: {} },
		},
	},
} as Meta;

const Template: Story<Record<string, IRadioButtonGroupSchema>> = (args) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						...args,
						...SubmitButtonStorybook,
					},
				},
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"radio-default": {
		uiType: "radio",
		label: "Radio Button",
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
			sections: {
				section: {
					uiType: "section",
					children: {
						"radio-default-value": {
							uiType: "radio",
							label: "Fruits",
							options: [
								{ label: "Apple", value: "Apple" },
								{ label: "Berry", value: "Berry" },
								{ label: "Cherry", value: "Cherry" },
							],
						},
						...SubmitButtonStorybook,
					},
				},
			},
			defaultValues: { "radio-default-value": "Apple" },
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"radio-disabled": {
		uiType: "radio",
		label: "Radio Button",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		disabled: true,
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"radio-with-validation": {
		uiType: "radio",
		label: "Radio Button",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		validation: [{ required: true }],
	},
};
