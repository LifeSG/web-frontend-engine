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

const Template: Story<Record<string, IAlertSchema>> = (args) => <FrontendEngine data={{ fields: { ...args } }} />;

export const Default = Template.bind({});
Default.args = {
	"alert-default": {
		fieldType: "alert",
		type: "success",
		children: "This is a success message",
	},
};

export const ReactNodeChildren = Template.bind({});
ReactNodeChildren.args = {
	"alert-react-node": {
		fieldType: "alert",
		type: "success",
		children: (
			<p>
				You can add <strong>bold text</strong> to signify or highlight certain information. Or perhaps even add
				a&nbsp;
				<a href="https://life.gov.sg" target="_blank" rel="noreferrer">
					hyperlink
				</a>
				&nbsp;to direct users to some external source.
			</p>
		),
	},
};

export const ReactNodeStringChildren = Template.bind({});
ReactNodeStringChildren.args = {
	"alert-react-node": {
		fieldType: "alert",
		type: "success",
		children: `<p>This is a <i>HTML</i> string</p>`,
	},
};

export const HTMLString = Template.bind({});
HTMLString.args = {
	"alert-react-node": {
		fieldType: "alert",
		type: "success",
		children: `<p>This component should not contain a script tag<script>console.log('hello world')</script></p>`,
	},
};
