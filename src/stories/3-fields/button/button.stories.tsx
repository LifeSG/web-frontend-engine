import * as Icons from "@lifesg/react-icons";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IButtonSchema } from "../../../components/fields/button";
import { CommonFieldStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE } from "../../common";
const meta: Meta = {
	title: "Field/Button",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Button</Title>
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
		...CommonFieldStoryProps("button"),
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
		startIcon: {
			description:
				"Add <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/story/collection--page'>Icon</a> to the start of button",

			control: {
				type: "select",
			},
			options: Object.keys(Icons),
		},
		endIcon: {
			description:
				"Add <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/story/collection--page'>Icon</a> to the end of button",
			control: {
				type: "select",
			},
			options: Object.keys(Icons),
		},
	},
};
export default meta;

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
				overrides: {
					[id]: args.overrides,
				},
			}}
		/>
	)) as StoryFn<IButtonSchema & { overrides?: Record<string, unknown> | undefined }>;

export const Default = Template("button-default").bind({});
Default.args = {
	uiType: "button",
	label: "Button",
};

export const Disabled = Template("button-disabled").bind({});
Disabled.args = {
	uiType: "button",
	label: "Disabled",
	disabled: true,
};

export const Styled = Template("button-styled").bind({});
Styled.args = {
	uiType: "button",
	label: "Secondary",
	styleType: "secondary",
};

export const Overrides = Template("button-overrides").bind({});
Overrides.args = {
	uiType: "button",
	label: "Overrides",
	overrides: { label: "Overridden" },
};

export const StartIcon = Template("button-startIcon").bind({});
StartIcon.args = {
	uiType: "button",
	label: "Button",
	startIcon: "AlbumFillIcon",
};
export const EndIcon = Template("button-endIcon").bind({});
EndIcon.args = {
	uiType: "button",
	label: "Button",
	styleType: "light",
	endIcon: "AlbumFillIcon",
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
