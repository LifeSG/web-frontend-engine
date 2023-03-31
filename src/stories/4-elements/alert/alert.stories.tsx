import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { IAlertSchema } from "../../../components/elements";
import { CommonFieldStoryProps, ExcludeReactFormHookProps } from "../../common";

export default {
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
		...ExcludeReactFormHookProps,
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
} as Meta;

const anchorProps = {
	href: "https://www.google.com",
	target: "_blank",
	rel: "noopener noreferrer",
};
const Template: Story<Record<string, IAlertSchema>> = (args) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: args,
				},
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"alert-default": {
		uiType: "alert",
		type: "success",
		children: "This is a success message",
	},
};

export const Warning = Template.bind({});
Warning.args = {
	"alert-warning": {
		uiType: "alert",
		type: "warning",
		children: "This is a warning message",
	},
};

export const Error = Template.bind({});
Error.args = {
	"alert-error": {
		uiType: "alert",
		type: "error",
		children: "This is a error message",
	},
};

export const ActionLink = Template.bind({});
ActionLink.args = {
	"alert-action-link": {
		uiType: "alert",
		type: "success",
		children: "This contains an action link that redirects to another page",
		actionLink: {
			...anchorProps,
			children: "Click here",
		},
	},
};

export const ReactNodeChildren = Template.bind({});
ReactNodeChildren.args = {
	"alert-react-node": {
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
	},
};

export const HTMLString = Template.bind({});
HTMLString.args = {
	"alert-html-string": {
		uiType: "alert",
		type: "success",
		children: `<p>This is a <i>HTML</i> string</p>`,
	},
};

export const SanitizedHTMLString = Template.bind({});
SanitizedHTMLString.args = {
	"alert-sanitized-html-string": {
		uiType: "alert",
		type: "success",
		children: `<p>This component should not contain a script tag<script>console.log('hello world')</script></p>`,
	},
};
