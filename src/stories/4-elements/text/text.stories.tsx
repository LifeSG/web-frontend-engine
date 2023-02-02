import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { ITextSchema } from "../../../components/elements";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, LOREM_IPSUM } from "../../common";

export default {
	title: "Element/Text",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Text</Title>
					<Description>
						This component renders a `Text` component provided by the Design System within a Frontend Engine
						generated form
					</Description>
					<Heading>Props</Heading>
					<Description>
						Please refer to the [design
						system](https://designsystem.life.gov.sg/react/index.html?path=/docs/general-text-introduction--introduction)
						for the properties of `Text`
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("text", true),
		"text-variants": { table: { disable: true } },
		children: {
			type: {
				name: "string",
				required: true,
			},
			description: "The content of the text component",
			table: {
				type: {
					summary: "string | string[] | Record<string, ITextSchema>",
				},
			},
		},
		fieldType: {
			description: "The type of the text component to be rendered",
			table: {
				type: {
					summary: `
						"text-d1" |
						"text-d2" |
						"text-dbody" |
						"text-h1" |
						"text-h2" |
						"text-h3" |
						"text-h4" |
						"text-h5" |
						"text-h6" |
						"text-body" |
						"text-bodysmall" |
						"text-xsmall"
					`,
				},
			},
			options: [
				"text-d1",
				"text-d2",
				"text-dbody",
				"text-h1",
				"text-h2",
				"text-h3",
				"text-h4",
				"text-h5",
				"text-h6",
				"text-body",
				"text-bodysmall",
				"text-xsmall",
			],
			control: {
				type: "select",
			},
		},
		weight: {
			description: "The weight of the text component",
			table: {
				type: {
					summary: '"regular" | "semibold" | "bold" | "light"',
				},
				defaultValue: { summary: "regular" },
			},
			options: ["regular", "semibold", "bold", "light"],
			control: {
				type: "select",
			},
		},
		inline: {
			description: "Sets the text to an inline display to allow a combination of components in a single line",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		paragraph: {
			description:
				"Adds an extra bottom margin to non header text to allow a better separation of blocks of text",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
	},
} as Meta;

const Template: Story<Record<string, ITextSchema>> = (args) => <FrontendEngine data={{ fields: { ...args } }} />;

export const Variants = Template.bind({});
Variants.args = {
	"text-variants": {
		fieldType: "text-body",
		children: {
			d1: {
				fieldType: "text-d1",
				children: LOREM_IPSUM("text-d1"),
			},
			d2: {
				fieldType: "text-d2",
				children: LOREM_IPSUM("text-d2"),
			},
			dbody: {
				fieldType: "text-dbody",
				children: LOREM_IPSUM("text-dbody"),
			},
			h1: {
				fieldType: "text-h1",
				children: LOREM_IPSUM("text-h1"),
			},
			h2: {
				fieldType: "text-h2",
				children: LOREM_IPSUM("text-h2"),
			},
			h3: {
				fieldType: "text-h3",
				children: LOREM_IPSUM("text-h3"),
			},
			h4: {
				fieldType: "text-h4",
				children: LOREM_IPSUM("text-h4"),
			},
			h5: {
				fieldType: "text-h5",
				children: LOREM_IPSUM("text-h5"),
			},
			h6: {
				fieldType: "text-h6",
				children: LOREM_IPSUM("text-h6"),
			},
			body: {
				fieldType: "text-body",
				children: LOREM_IPSUM("text-body"),
			},
			bodysmall: {
				fieldType: "text-bodysmall",
				children: LOREM_IPSUM("text-bodysmall"),
			},
			xsmall: {
				fieldType: "text-xsmall",
				children: LOREM_IPSUM("text-xsmall"),
			},
		},
	},
};

export const Weights = Template.bind({});
Weights.args = {
	"text-weights": {
		fieldType: "text-body",
		children: {
			default: {
				fieldType: "text-body",
				children: LOREM_IPSUM("Default"),
			},
			bold: {
				fieldType: "text-body",
				children: LOREM_IPSUM("Bold"),
				weight: "bold",
			},
			semibold: {
				fieldType: "text-body",
				children: LOREM_IPSUM("Semibold"),
				weight: "semibold",
			},
			light: {
				fieldType: "text-body",
				children: LOREM_IPSUM("Light"),
				weight: "light",
			},
		},
	},
};

export const ArrayOfText = Template.bind({});
ArrayOfText.args = {
	"text-array": {
		fieldType: "text-body",
		children: ["This", "is", "an", "array", "of", "text"],
	},
};

export const ArrayOfStyledText = Template.bind({});
ArrayOfStyledText.args = {
	"text-array-plain-styled": {
		fieldType: "text-body",
		children: ["This", "<mark>is</mark>", "<u>a</u>", "<strong>styled</strong>", "<i>sentence</i>"],
	},
};

export const InlineText = Template.bind({});
InlineText.args = {
	"text-inline": {
		fieldType: "text-body",
		children: {
			"text-start": {
				fieldType: "text-body",
				children: "This is ",
				inline: true,
			},
			"text-body": {
				fieldType: "text-body",
				children: "an inline ",
				inline: true,
			},
			"text-end": {
				fieldType: "text-body",
				children: "text",
				inline: true,
			},
		},
	},
};

export const ParagraphText = Template.bind({});
ParagraphText.args = {
	"text-paragraph": {
		fieldType: "text-body",
		children: {
			"text-paragraph-one": {
				fieldType: "text-body",
				children: "This is the first paragraph",
				paragraph: true,
			},
			"text-paragraph-two": {
				fieldType: "text-body",
				children: "This is the second paragraph",
				paragraph: true,
			},
			"text-paragraph-three": {
				fieldType: "text-body",
				children: "This is the third paragraph",
				paragraph: true,
			},
		},
	},
};

export const HTMLString = Template.bind({});
HTMLString.args = {
	"text-html-string": {
		fieldType: "text-body",
		children: "<p>This is a paragraph in a HTML string</p>",
	},
};

export const SanitizedHTMLString = Template.bind({});
SanitizedHTMLString.args = {
	"text-sanitized-html-string": {
		fieldType: "text-body",
		children: "<p>This component should not contain a script tag<script>console.log('hello world')</script></p>",
	},
};
