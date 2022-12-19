import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { IWrapperSchema } from "../../../components/elements/wrapper";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Element/Wrapper",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Wrapper</Title>
					<Description>
						All-purpose component to wrap fields or add copy. This can be used to group fields, layout the
						form or add copy in between fields.
					</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("wrapper"),
		label: { table: { disable: true } },
		fieldType: {
			description: "Actual HTML element type to render the component as",
			table: {
				type: {
					summary: "div|span|section|header|footer|h1|h2|h3|h4|h5|h6|p",
				},
			},
			type: { name: "string", required: true },
			options: ["div", "span", "section", "header", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "p"],
			control: {
				type: "select",
			},
		},
		children: {
			description: "Elements or string that is the descendant of this component",
			table: {
				type: {
					summary: "TFrontendEngineFieldSchema | string | (string | TFrontendEngineFieldSchema)[]",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
	},
} as Meta;

const Template: Story<Record<string, IWrapperSchema>> = (args) => <FrontendEngine data={{ fields: args }} />;

export const Default = Template.bind({});
Default.args = {
	"wrapper-default": {
		fieldType: "div",
		children: {
			name: {
				label: "What is your name",
				fieldType: "textarea",
				validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
				chipTexts: ["John", "Doe"],
			},
			...SubmitButtonStorybook,
		},
	},
};

export const String = Template.bind({});
String.args = {
	"wrapper-string": {
		fieldType: "div",
		children: "Hello world",
	},
};

export const StringAndField = Template.bind({});
StringAndField.args = {
	"wrapper-field-and-string": {
		fieldType: "div",
		children: {
			"child-string": {
				fieldType: "h6",
				className: "margin--bottom",
				children: "Fill in your name below",
			},
			"child-name": {
				label: "What is your name",
				fieldType: "textarea",
				validation: [{ required: true }],
				chipTexts: ["John", "Doe"],
			},
			...SubmitButtonStorybook,
		},
	},
};

export const VariousElements = () => (
	<FrontendEngine
		data={{
			fields: {
				"wrapper-div": {
					fieldType: "div",
					children: "Div",
				},
				"wrapper-span": {
					fieldType: "span",
					children: "Span",
				},
				"wrapper-section": {
					fieldType: "section",
					children: "Section",
				},
				"wrapper-header": {
					fieldType: "header",
					children: "Header",
				},
				"wrapper-footer": {
					fieldType: "footer",
					children: "Footer",
				},
				"wrapper-h1": {
					fieldType: "h1",
					children: "H1",
				},
				"wrapper-h2": {
					fieldType: "h2",
					children: "H2",
				},
				"wrapper-h3": {
					fieldType: "h3",
					children: "H3",
				},
				"wrapper-h4": {
					fieldType: "h4",
					children: "H4",
				},
				"wrapper-h5": {
					fieldType: "h5",
					children: "H5",
				},
				"wrapper-h6": {
					fieldType: "h6",
					children: "H6",
				},
			},
		}}
	/>
);

export const Layout = Template.bind({});
Layout.args = {
	"wrapper-row-1": {
		fieldType: "div",
		className: "row",
		children: {
			"wrapper-row-1-col": {
				fieldType: "div",
				className: "col is-full is-boxed",
				children: "Create complex layouts with custom css classes",
			},
		},
	},
	"wrapper-row-2": {
		fieldType: "div",
		className: "row",
		children: {
			"wrapper-row-2-col-1": {
				fieldType: "div",
				className: "col is-half is-boxed",
				children: "Column 1",
			},
			"wrapper-row-2-col-2": {
				fieldType: "div",
				className: "col is-half is-boxed",
				children: {
					"wrapper-row-2-col-2-1": {
						fieldType: "div",
						className: "col is-full is-boxed",
						children: "Column 2 Row 1",
					},
					"wrapper-row-2-col-2-2": {
						fieldType: "div",
						className: "col is-full is-boxed",
						children: "Column 2 Row 2",
					},
				},
			},
		},
	},
};
