import * as Icons from "@lifesg/react-icons";
import { action } from "@storybook/addon-actions";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useEffect, useRef } from "react";
import { IFrontendEngineRef } from "../../../components";
import { IButtonSchema } from "../../../components/fields/button";
import { CommonFieldStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE } from "../../common";

const meta: Meta = {
	title: "Field/Button",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Button</Title>
					<Description>
						A clickable component that fires a click event when activated. This component does not trigger a
						form submission.
					</Description>
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
		validation: { table: { disable: true } },
		disabled: {
			description: "Specifies if the button is interactable",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			control: {
				type: "boolean",
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
		startIcon: {
			description:
				"Add an icon based on <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/story/collection--page' target='_blank' rel='noopener noreferrer'>React Icons</a> before the button label",
			table: {
				type: {
					summary: "Refer to React Icons",
				},
			},
			control: {
				type: "select",
			},
			options: Object.keys(Icons),
		},
		endIcon: {
			description:
				"Add an icon based on <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/story/collection--page' target='_blank' rel='noopener noreferrer'>React Icons</a> after the button label",
			table: {
				type: {
					summary: "Refer to React Icons",
				},
			},
			control: {
				type: "select",
			},
			options: Object.keys(Icons),
		},
	},
};
export default meta;

/* eslint-disable react-hooks/rules-of-hooks */
const Template = (id: string, eventName?: string | undefined) =>
	((args) => {
		const formRef = useRef<IFrontendEngineRef>();
		const handleEvent = (e: unknown) => action(eventName)(e);

		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(eventName, id, handleEvent);
			return () => currentFormRef.removeFieldEventListener(eventName, id, handleEvent);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
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
				ref={formRef}
			/>
		);
	}) as StoryFn<IButtonSchema & { overrides?: Record<string, unknown> | undefined }>;
/* eslint-enable react-hooks/rules-of-hooks */

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
Overrides.argTypes = OVERRIDES_ARG_TYPE;

export const StartIcon = Template("button-start-icon").bind({});
StartIcon.args = {
	uiType: "button",
	label: "Button",
	startIcon: "AlbumFillIcon",
};

export const EndIcon = Template("button-end-icon").bind({});
EndIcon.args = {
	uiType: "button",
	label: "Button",
	endIcon: "AlbumFillIcon",
};

export const ClickEvent = Template("button-click-event", "click").bind({});
ClickEvent.args = {
	uiType: "button",
	label: "Button",
};
