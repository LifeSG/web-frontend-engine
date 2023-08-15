import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IAlertSchema } from "../../../components/elements";
import { CommonFieldStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Element/Alert",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Alert</Title>
					<Description>
						This component renders a `Alert` component provided by the Design System within a Frontend
						Engine generated form
					</Description>
					<Heading>Props</Heading>
					<Description>
						Please refer to the [design
						system](https://designsystem.life.gov.sg/react/index.html?path=/docs/modules-alert--alert) for
						the properties of `Alert`
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("alert", true),
		children: {
			type: {
				name: "string",
				required: true,
			},
			description: "The content of the alert component",
			table: {
				type: {
					summary: "string | React.ReactNode",
				},
			},
		},
		actionLink: {
			description: "The action link to render at the end of the the alert component",
			table: {
				type: {
					summary: "React.AnchorHTMLAttributes",
				},
			},
		},
		type: {
			description: "The style of the alert component",
			type: {
				name: "string",
				required: true,
			},
			table: {
				type: {
					summary: '"success" | "warning" | "error"',
				},
			},
			options: ["success", "warning", "error"],
			control: {
				type: "select",
			},
		},
	},
};
export default meta;

const anchorProps = {
	href: "https://www.google.com",
	target: "_blank",
	rel: "noopener noreferrer",
};

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
	)) as StoryFn<IAlertSchema>;

export const Default = Template("alert-default").bind({});
Default.args = {
	uiType: "alert",
	type: "success",
	children: "This is a success message",
	className: "margin--bottom",
};

export const Warning = Template("alert-warning").bind({});
Warning.args = {
	uiType: "alert",
	type: "warning",
	children: "This is a warning message",
};

export const Error = Template("alert-error").bind({});
Error.args = {
	uiType: "alert",
	type: "error",
	children: "This is a error message",
};

export const ActionLink = Template("alert-action-link").bind({});
ActionLink.args = {
	uiType: "alert",
	type: "success",
	children: "This contains an action link that redirects to another page",
	actionLink: {
		...anchorProps,
		children: "Click here",
	},
};

export const ReactNodeChildren = Template("alert-react-node").bind({});
ReactNodeChildren.args = {
	uiType: "alert",
	type: "success",
	children: (
		<p>
			You can add <strong>bold text</strong> to signify or highlight certain information. Or perhaps even add
			a&nbsp;
			<a {...anchorProps}>hyperlink</a>
			&nbsp;to direct users to some external source.
		</p>
	),
};

export const HTMLString = Template("alert-html-string").bind({});
HTMLString.args = {
	uiType: "alert",
	type: "success",
	children: "<p>This is a <i>HTML</i> string</p>",
};

export const SanitizedHTMLString = Template("alert-sanitized-html-string").bind({});
SanitizedHTMLString.args = {
	uiType: "alert",
	type: "success",
	children: "<p>This component should not contain a script tag<script>console.log('hello world')</script></p>",
};

export const Overrides = OverrideStoryTemplate<IAlertSchema>("alert-overrides", false).bind({});
Overrides.args = {
	uiType: "alert",
	type: "success",
	children: "This is a success message",
	overrides: {
		type: "warning",
		children: "This has been overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
