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
					summary: `"D1" | "D2" | "DBody" | "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | "Body" | "BodySmall" | "XSmall"`,
				},
			},
			options: ["D1", "D2", "DBody", "H1", "H2", "H3", "H4", "H5", "H6", "Body", "BodySmall", "XSmall"],
			control: {
				type: "select",
			},
			defaultValue: "text-bodynbp",
		},
		weight: {
			description: "The weight of the text component",
			table: {
				type: {
					summary: '"regular" | "semibold" | "bold" | "light"',
				},
			},
			options: ["regular", "semibold", "bold", "light"],
			control: {
				type: "select",
			},
			defaultValue: "regular",
		},
		inline: {
			description: "Sets the text to an inline display to allow a combination of components in a single line",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		paragraph: {
			description:
				"Adds an extra bottom margin to non header text to allow a better separation of blocks of text",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
	},
} as Meta;

const Template: Story<Record<string, ITextSchema>> = (args) => <FrontendEngine data={{ fields: { ...args } }} />;

export const Variants = Template.bind({});
Variants.args = {
	"text-variants": {
		fieldType: "Body",
		children: {
			d1: {
				fieldType: "D1",
				children: LOREM_IPSUM("D1"),
			},
			d2: {
				fieldType: "D2",
				children: LOREM_IPSUM("D2"),
			},
			dbody: {
				fieldType: "DBody",
				children: LOREM_IPSUM("DBody"),
			},
			h1: {
				fieldType: "H1",
				children: LOREM_IPSUM("H1"),
			},
			h2: {
				fieldType: "H2",
				children: LOREM_IPSUM("H2"),
			},
			h3: {
				fieldType: "H3",
				children: LOREM_IPSUM("H3"),
			},
			h4: {
				fieldType: "H4",
				children: LOREM_IPSUM("H4"),
			},
			h5: {
				fieldType: "H5",
				children: LOREM_IPSUM("H5"),
			},
			h6: {
				fieldType: "H6",
				children: LOREM_IPSUM("H6"),
			},
			body: {
				fieldType: "Body",
				children: LOREM_IPSUM("body"),
			},
			bodysmall: {
				fieldType: "BodySmall",
				children: LOREM_IPSUM("BodySmall"),
			},
			xsmall: {
				fieldType: "XSmall",
				children: LOREM_IPSUM("XSmall"),
			},
		},
	},
};

export const Weights = Template.bind({});
Weights.args = {
	"text-weights": {
		fieldType: "Body",
		children: {
			default: {
				fieldType: "Body",
				children: LOREM_IPSUM("Default"),
			},
			bold: {
				fieldType: "Body",
				children: LOREM_IPSUM("Bold"),
				weight: "bold",
			},
			semibold: {
				fieldType: "Body",
				children: LOREM_IPSUM("Semibold"),
				weight: "semibold",
			},
			light: {
				fieldType: "Body",
				children: LOREM_IPSUM("Light"),
				weight: "light",
			},
		},
	},
};

export const ArrayOfText = Template.bind({});
ArrayOfText.args = {
	"text-array": {
		fieldType: "Body",
		children: ["This", "is", "an", "array", "of", "text"],
	},
};

export const ArrayOfStyledText = Template.bind({});
ArrayOfStyledText.args = {
	"text-array-plain-styled": {
		fieldType: "Body",
		children: ["This", "<mark>is</mark>", "<u>a</u>", "<strong>styled</strong>", "<i>sentence</i>"],
	},
};

export const InlineText = Template.bind({});
InlineText.args = {
	"text-inline": {
		fieldType: "Body",
		children: {
			"text-start": {
				fieldType: "Body",
				children: "This is ",
				inline: true,
			},
			"text-body": {
				fieldType: "Body",
				children: "an inline ",
				inline: true,
			},
			"text-end": {
				fieldType: "Body",
				children: "text",
				inline: true,
			},
		},
	},
};

export const ParagraphText = Template.bind({});
ParagraphText.args = {
	"text-paragraph": {
		fieldType: "Body",
		children: {
			"text-paragraph-one": {
				fieldType: "Body",
				children: "This is the first paragraph",
				paragraph: true,
			},
			"text-paragraph-two": {
				fieldType: "Body",
				children: "This is the second paragraph",
				paragraph: true,
			},
			"text-paragraph-three": {
				fieldType: "Body",
				children: "This is the third paragraph",
				paragraph: true,
			},
		},
	},
};

export const HTMLString = Template.bind({});
HTMLString.args = {
	"text-html-string": {
		fieldType: "Body",
		children: "<p>This is a paragraph in a HTML string</p>",
	},
};

export const SanitizedHTMLString = Template.bind({});
SanitizedHTMLString.args = {
	"text-sanitized-html-string": {
		fieldType: "Body",
		children: "<p>This component should not contain a script tag<script>console.log('hello world')</script></p>",
	},
};
