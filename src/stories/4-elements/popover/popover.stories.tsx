import * as Icons from "@lifesg/react-icons";
import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IPopoverSchema } from "../../../components/elements";
import { CommonFieldStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Element/Popover",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Popover</Title>
					<p>
						This component renders text with an optional icon that triggers a <code>Popover</code> within a
						Frontend Engine generated form.
					</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("popover", true),
		children: {
			type: {
				name: "string",
				required: true,
			},
			description: "The content of the popover trigger",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		icon: {
			description:
				"Add an icon based on <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/docs/collection--docs' target='_blank' rel='noopener noreferrer'>React Icons</a>",
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
		hint: {
			description: `The popover configuration
				<ul>
					<li>content: Content to display in the popover.</li>
					<li>zIndex: Customises the popover z-index.</li>
				</ul>
			`,
			table: {
				type: {
					summary: "{ content: string; zIndex?: number }",
				},
			},
		},
		trigger: {
			description: "Activate the popover via click or hover",
			table: {
				type: {
					summary: "click | hover",
				},
				defaultValue: {
					summary: "click",
				},
			},
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
			}}
		/>
	)) as StoryFn<IPopoverSchema>;

export const Default = Template("popover-default").bind({});
Default.args = {
	uiType: "popover",
	children: "More info",
	hint: { content: "Hint" },
};

export const WithIcon = Template("popover-with-icon").bind({});
WithIcon.args = {
	uiType: "popover",
	children: "More info",
	icon: "ICircleFillIcon",
	hint: { content: "Hint" },
};

export const IconOnly = Template("popover-icon-only").bind({});
IconOnly.args = {
	uiType: "popover",
	icon: "ICircleFillIcon",
	hint: { content: "Hint" },
};

export const HTMLString = Template("popover-html-string").bind({});
HTMLString.args = {
	uiType: "popover",
	children: "More <em>important</em> info",
	hint: { content: "Hint" },
};

export const TooltipCustomisation = Template("popover-tooltip-customisation").bind({});
TooltipCustomisation.args = {
	uiType: "popover",
	children: "More info",
	hint: { content: "A helpful tip<br>Another helpful tip on next line" },
};

export const Hover = Template("popover-hover").bind({});
Hover.args = {
	uiType: "popover",
	children: "More info",
	trigger: "hover",
	hint: { content: "Hint" },
};

export const InlineUsage: StoryFn = () => {
	return (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							text: {
								uiType: "text-body",
								children: {
									1: { uiType: "text-body", children: "Click ", inline: true },
									2: {
										uiType: "popover",
										children: "here",
										hint: { content: "Hint" },
										icon: "QuestionmarkCircleFillIcon",
									},
									3: { uiType: "text-body", children: " to find out more", inline: true },
								},
							},
						},
					},
				},
			}}
		/>
	);
};

export const Overrides = OverrideStoryTemplate<IPopoverSchema>("popover-overrides", false).bind({});
Overrides.args = {
	uiType: "popover",
	children: "Popover",
	hint: { content: "Hint" },
	overrides: {
		children: "Overridden",
		hint: { content: "Overridden" },
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
