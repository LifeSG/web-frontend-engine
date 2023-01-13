import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { ISubmitButtonSchema } from "../../../components/fields";
import { CommonFieldStoryProps, ExcludeReactFormHookProps } from "../../common";

export default {
	title: "Field/SubmitButton",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>SubmitButton</Title>
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
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("submit"),
		validation: { table: { disable: true } },
		submit: { table: { disable: true } },
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
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
	},
} as Meta;

const Template: Story<Record<string, ISubmitButtonSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args } }} />
);

export const Default = Template.bind({});
Default.args = {
	"submit-default": {
		fieldType: "submit",
		label: "Submit",
	},
};

export const Disabled = Template.bind({});
Disabled.args = {
	"submit-disabled": {
		fieldType: "submit",
		label: "Submit",
		disabled: true,
	},
};

export const Styled = Template.bind({});
Styled.args = {
	"submit-styled": {
		fieldType: "submit",
		label: "Submit",
		styleType: "secondary",
	},
};
