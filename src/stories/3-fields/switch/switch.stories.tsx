import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ISwitchSchema } from "../../../components/fields/switch/types";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Field/Switch",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Switch Toggle Button</Title>
					<Description>This component provides a set of switch toggle buttons for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("switch"),
		disabled: {
			description: "Specifies if the switch buttons should be disabled",
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
		customOptions: {
			description: "<ul><li>`border` show/hide border,`true` by default.</li></ul>",
			table: {
				type: {
					summary: `{border?: boolean}`,
				},
			},
			type: { name: "object", value: {} },
		},
	},
} as Meta;

const Template = (id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
							...SUBMIT_BUTTON_SCHEMA,
						},
					},
				},
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as Story<ISwitchSchema & { defaultValues?: boolean | undefined }>;

export const Default = Template("switch-default").bind({});
Default.args = {
	uiType: "switch",
	label: "Switch",
};

export const DefaultValue = Template("switch-default-value").bind({});
DefaultValue.args = {
	uiType: "switch",
	label: "Switch",
	defaultValues: true,
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "boolean",
			},
		},
		control: {
			type: "boolean",
		},
	},
};

export const Disabled = Template("switch-disabled").bind({});
Disabled.args = {
	uiType: "switch",
	label: "Switch",
	disabled: true,
};

export const WithValidation = Template("switch-with-validation").bind({});
WithValidation.args = {
	uiType: "switch",
	label: "Switch",
	validation: [{ required: true }],
};

export const WithoutBorder = Template("switch-without-border").bind({});
WithoutBorder.args = {
	uiType: "switch",
	label: "Switch",
	customOptions: {
		border: false,
	},
};
