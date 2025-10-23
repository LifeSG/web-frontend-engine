import * as Icons from "@lifesg/react-icons";
import { action } from "@storybook/addon-actions";
import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
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
					<p>
						A clickable component that fires a click event when activated. This component does not trigger a
						form submission.
					</p>
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
		...CommonFieldStoryProps("button"),
		validation: { table: { disable: true } },
		disabled: {
			description: "Specifies if the button is interactable",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
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
		href: {
			description:
				"URL to navigate to when the button is clicked. Must be a valid URL with supported protocols (http, https, mailto, tel)",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		target: {
			description: "Specifies where to open the linked document.",
			table: {
				type: {
					summary: "'_blank' | '_self' | '_parent' | '_top'",
				},
				defaultValue: { summary: "undefined" },
			},
			control: {
				type: "select",
			},
			options: ["_blank", "_self", "_parent", "_top"],
		},
	},
};
export default meta;

/* eslint-disable react-hooks/rules-of-hooks */
const Template = (id: string, eventName?: string | undefined) =>
	((args) => {
		const formRef = useRef<IFrontendEngineRef>(null);
		const handleEvent = (e: unknown) => action(eventName)(e);

		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener("button", eventName as any, id, handleEvent);
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

export const LinkOption = Template("button-link-option", "click").bind({});
LinkOption.args = {
	uiType: "button",
	href: "https://example.com/",
	label: "Button",
};

export const LinkOptionWithTarget = Template("button-link-option-with-target", "click").bind({});
LinkOptionWithTarget.args = {
	uiType: "button",
	href: "https://example.com/",
	label: "Button",
	target: "_blank",
};
