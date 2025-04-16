import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { TWrapperSchema } from "../../../components/elements/wrapper";
import {
	CommonFieldStoryProps,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	SUBMIT_BUTTON_SCHEMA,
} from "../../common";

const meta: Meta = {
	title: "Element/Wrapper",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Wrapper</Title>
					<p>
						All-purpose component to wrap fields or add copy. This can be used to group fields, layout the
						form or add copy in between fields.
					</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("wrapper"),
		label: { table: { disable: true } },
		uiType: {
			description: "Actual HTML element type to render the component as",
			table: {
				type: {
					summary: "div|span|header|footer|p",
				},
			},
			type: { name: "string", required: true },
			options: ["div", "span", "header", "footer", "p"],
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
		colType: {
			description: `Specifies the grid system version to use. When set to <code>v2</code> (or left <code>undefined</code> ), the columns property expects <code>IColumns</code>  type.<br/>
			When set to <code>v3</code>, the columns property expects <code>ColProps</code> type.`,
			table: {
				type: {
					summary: "'v2' | 'v3' | undefined",
				},
				defaultValue: { summary: "v2" },
			},
			control: {
				type: "select",
				options: ["v2", "v3"],
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
	)) as StoryFn<TWrapperSchema>;

const SectionTemplate: StoryFn<Record<string, TWrapperSchema>> = (args) => (
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

export const Default = Template("wrapper-default").bind({});
Default.args = {
	uiType: "div",
	children: {
		name: {
			label: "What is your name",
			uiType: "textarea",
			validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
			chipTexts: ["John", "Doe"],
		},
		...SUBMIT_BUTTON_SCHEMA,
	},
};

export const String = Template("wrapper-string").bind({});
String.args = {
	uiType: "div",
	children: "Hello world",
};

export const StringAndField = Template("wrapper-field-and-string").bind({});
StringAndField.args = {
	uiType: "div",
	columns: {
		xlCols: 1,
	},
	children: {
		"child-string": {
			uiType: "h6",
			className: "margin-bottom-1",
			children: "Fill in your name below",
		},
		"child-name": {
			label: "What is your name",
			uiType: "textarea",
			validation: [{ required: true }],
			chipTexts: ["John", "Doe"],
		},
		...SUBMIT_BUTTON_SCHEMA,
	},
};

export const VariousElements = SectionTemplate.bind({});
VariousElements.args = {
	"wrapper-div": {
		uiType: "div",
		children: "Div",
	},
	"wrapper-span": {
		uiType: "span",
		children: "Span",
	},
	"wrapper-header": {
		uiType: "header",
		children: "Header",
	},
	"wrapper-footer": {
		uiType: "footer",
		children: "Footer",
	},
	"wrapper-h1": {
		uiType: "h1",
		children: "H1",
	},
	"wrapper-h2": {
		uiType: "h2",
		children: "H2",
	},
	"wrapper-h3": {
		uiType: "h3",
		children: "H3",
	},
	"wrapper-h4": {
		uiType: "h4",
		children: "H4",
	},
	"wrapper-h5": {
		uiType: "h5",
		children: "H5",
	},
	"wrapper-h6": {
		uiType: "h6",
		children: "H6",
	},
};
VariousElements.parameters = {
	controls: {
		exclude: /.*/g,
		hideNoControlsWarning: true,
	},
};

export const Layout = SectionTemplate.bind({});
Layout.args = {
	"wrapper-row-1": {
		uiType: "div",
		className: "row",
		children: {
			"wrapper-row-1-col": {
				uiType: "div",
				className: "col is-full is-boxed",
				children: "Create complex layouts with custom css classes",
			},
		},
	},
	"wrapper-row-2": {
		uiType: "div",
		className: "row",
		children: {
			"wrapper-row-2-col-1": {
				uiType: "div",
				className: "col is-half is-boxed",
				children: "Column 1",
			},
			"wrapper-row-2-col-2": {
				uiType: "div",
				className: "col is-half is-boxed",
				children: {
					"wrapper-row-2-col-2-1": {
						uiType: "div",
						className: "col is-full is-boxed",
						children: "Column 2 Row 1",
					},
					"wrapper-row-2-col-2-2": {
						uiType: "div",
						className: "col is-full is-boxed",
						children: "Column 2 Row 2",
					},
				},
			},
		},
	},
};
Layout.parameters = VariousElements.parameters;

export const Overrides = OverrideStoryTemplate<TWrapperSchema>("wrapper-overrides", false).bind({});
Overrides.args = {
	uiType: "div",
	children: {
		name: {
			label: "What is your name",
			uiType: "textarea",
			validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
			chipTexts: ["John", "Doe"],
		},
	},
	overrides: {
		children: {
			name: {
				label: "Overridden textarea",
				chipTexts: ["Overridden", "Chip"],
			},
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
