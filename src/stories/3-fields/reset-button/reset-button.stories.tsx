import { ArgTypes, Stories, Title } from "@storybook/addon-docs/blocks";
import { Meta, StoryFn } from "@storybook/react-webpack5";
import { IResetButtonSchema } from "../../../components/fields";
import { CommonFieldStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE } from "../../common";

const meta: Meta = {
	title: "Field/ResetButton",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ResetButton</Title>
					<p>A button that resets form fields to their default values.</p>
					<p>
						This component also inherits the{" "}
						<a
							href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement"
							target="_blank"
							rel="noopener noreferrer"
						>
							HTMLButtonElement
						</a>{" "}
						attributes.
					</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("reset"),
		validation: { table: { disable: true } },
		label: {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
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
		sizeType: {
			description: "The size of the button",
			table: {
				type: {
					summary: "default | small | large",
				},
			},
			options: ["default", "small", "large"],
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
				defaultValue: { summary: "false" },
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
				defaultValue: { summary: "false" },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
	},
};
export default meta;

const Template = (id: string, defaultValue?: string | undefined) =>
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
				overrides: { [id]: args.overrides },
			}}
		/>
	)) as StoryFn<IResetButtonSchema & { overrides?: Record<string, unknown> | undefined }>;

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

export const Size = Template("reset-size").bind({});
Size.args = {
	uiType: "reset",
	label: "Reset",
	sizeType: "large",
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

export const Overrides = Template("reset-overrides").bind({});
Overrides.args = {
	uiType: "reset",
	label: "Reset",
	overrides: { label: "Overridden" },
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
