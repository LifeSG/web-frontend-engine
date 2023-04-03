import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ISubmitButtonSchema } from "../../../components/fields";
import { CommonFieldStoryProps, FrontendEngine } from "../../common";

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
		...CommonFieldStoryProps("submit"),
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
			description:
				"Specifies if the button is interactable<br>For `invalid-form`, the button will remain disabled until the form is valid",
			table: {
				type: {
					summary: "boolean | invalid-form",
				},
				defaultValue: { summary: false },
			},
			options: [true, false, "invalid-form"],
			control: {
				type: "select",
			},
		},
	},
} as Meta;

const Template = (id: string) =>
	((args) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
						},
					},
				},
			}}
		/>
	)) as Story<ISubmitButtonSchema>;

export const Default = Template("submit-default").bind({});
Default.args = {
	uiType: "submit",
	label: "Submit",
};

export const Disabled = Template("submit-disabled").bind({});
Disabled.args = {
	uiType: "submit",
	label: "Submit",
	disabled: true,
};

export const Styled = Template("submit-styled").bind({});
Styled.args = {
	uiType: "submit",
	label: "Submit",
	styleType: "secondary",
};

export const DisabledOnInvalidForm = (args: ISubmitButtonSchema) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						required: {
							uiType: "text-field",
							label: "Required",
							validation: [{ required: true }],
						},
						email: {
							uiType: "email-field",
							label: "Email",
							validation: [{ required: true }],
						},
						submit: args,
					},
				},
			},
		}}
	/>
);
DisabledOnInvalidForm.args = {
	uiType: "submit",
	label: "Submit",
	disabled: "invalid-form",
};
