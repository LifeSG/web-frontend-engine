import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IResetButtonSchema } from "../../../components/fields";
import { CommonFieldStoryProps, FrontendEngine } from "../../common";

export default {
	title: "Field/ResetButton",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ResetButton</Title>
					<Description>The primary call to action component</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement)
						attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("reset"),
		validation: { table: { disable: true } },
		styleType: {
			description: "The style type of the button",
			table: {
				type: {
					summary: "default | secondary | light | link",
				},
			},
			options: ["default", "secondary", "light", "link"],
			control: {
				type: "select",
			},
		},
		disabled: {
			description: "Specifies if the button is interactable",
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
		ignoreDefaultValues: {
			description: "Specifies if button should reset all fields and default values to blank",
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
} as Meta;

const Template = (id: string, defaultValue?: string) =>
	((args) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							field: {
								uiType: "text-field",
								label: "Field",
								validation: [{ required: true }],
							},
							[id]: args,
						},
					},
				},
				defaultValues: { field: defaultValue },
			}}
		/>
	)) as Story<IResetButtonSchema>;

export const Default = Template("reset-default").bind({});
Default.args = {
	uiType: "reset",
	label: "Reset",
};

export const Disabled = Template("reset-disabled").bind({});
Disabled.args = {
	uiType: "reset",
	label: "Reset",
	disabled: true,
};

export const Styled = Template("reset-styled").bind({});
Styled.args = {
	uiType: "reset",
	label: "Reset",
	styleType: "secondary",
};

export const DefaultValue = Template("reset-default-value", "default").bind({});
DefaultValue.args = {
	uiType: "reset",
	label: "Reset",
};

export const IgnoreDefaultValue = Template("reset-ignore-default-value", "default").bind({});
IgnoreDefaultValue.args = {
	uiType: "reset",
	label: "Reset",
	ignoreDefaultValues: true,
};
