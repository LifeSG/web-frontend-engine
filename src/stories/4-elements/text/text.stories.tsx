import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { ITextSchema, ITypographySchema } from "../../../components/elements";
import { CommonFieldStoryProps, FrontendEngine, LOREM_IPSUM } from "../../common";

const meta: Meta = {
	title: "Element/Text",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Text</Title>
					<p>
						This component renders a <code>Text</code> component provided by the Design System within a
						Frontend Engine generated form.
					</p>

					<p>
						Please refer to the{" "}
						<a
							href="https://designsystem.life.gov.sg/react/index.html?path=/docs/general-text-introduction--introduction"
							target="_blank"
							rel="noopener noreferrer"
						>
							design system
						</a>{" "}
						for the properties of <code>Text</code>.
					</p>
					<ArgTypes of={Variants} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
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
					summary: "string | string[] | Record<string, ITextSchema | ITypographySchema>",
				},
			},
		},
		uiType: {
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
			description: `The weight of the text component.<br>
			For backward compatibility, Numeric values will be mapped to the corresponding weight.<br>
			300: <code>light</code><br>
			400: <code>regular</code><br>
			600: <code>semibold</code><br>
			700: <code>bold</code><br>
			900: <code>bold</code>`,
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
				defaultValue: { summary: "false" },
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
				defaultValue: { summary: "false" },
			},
			options: [true, false],
			control: {
				type: "boolean",
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
	)) as StoryFn<ITextSchema | ITypographySchema>;

export const Variants = Template("text-variants").bind({});
Variants.args = {
	uiType: "text-body",
	children: {
		d1: {
			uiType: "text-d1",
			children: LOREM_IPSUM("text-d1"),
		},
		d2: {
			uiType: "text-d2",
			children: LOREM_IPSUM("text-d2"),
		},
		dbody: {
			uiType: "text-dbody",
			children: LOREM_IPSUM("text-dbody"),
		},
		h1: {
			uiType: "text-h1",
			children: LOREM_IPSUM("text-h1"),
		},
		h2: {
			uiType: "text-h2",
			children: LOREM_IPSUM("text-h2"),
		},
		h3: {
			uiType: "text-h3",
			children: LOREM_IPSUM("text-h3"),
		},
		h4: {
			uiType: "text-h4",
			children: LOREM_IPSUM("text-h4"),
		},
		h5: {
			uiType: "text-h5",
			children: LOREM_IPSUM("text-h5"),
		},
		h6: {
			uiType: "text-h6",
			children: LOREM_IPSUM("text-h6"),
		},
		body: {
			uiType: "text-body",
			children: LOREM_IPSUM("text-body"),
		},
		bodysmall: {
			uiType: "text-bodysmall",
			children: LOREM_IPSUM("text-bodysmall"),
		},
		xsmall: {
			uiType: "text-xsmall",
			children: LOREM_IPSUM("text-xsmall"),
		},
	},
};

export const Weights = Template("text-weights").bind({});
Weights.args = {
	uiType: "text-body",
	children: {
		default: {
			uiType: "text-body",
			children: LOREM_IPSUM("Default"),
		},
		bold: {
			uiType: "text-body",
			children: LOREM_IPSUM("Bold"),
			weight: "bold",
		},
		semibold: {
			uiType: "text-body",
			children: LOREM_IPSUM("Semibold"),
			weight: "semibold",
		},
		light: {
			uiType: "text-body",
			children: LOREM_IPSUM("Light"),
			weight: "light",
		},
	},
};

export const ArrayOfText = Template("text-array").bind({});
ArrayOfText.args = {
	uiType: "text-body",
	children: ["This", "is", "an", "array", "of", "text"],
};

export const ArrayOfStyledText = Template("text-array-plain-styled").bind({});
ArrayOfStyledText.args = {
	uiType: "text-body",
	children: ["This", "<mark>is</mark>", "<u>a</u>", "<strong>styled</strong>", "<i>sentence</i>"],
};

export const InlineText = Template("text-inline").bind({});
InlineText.args = {
	uiType: "text-body",
	children: {
		"text-start": {
			uiType: "text-body",
			children: "This is ",
			inline: true,
		},
		"text-body": {
			uiType: "text-body",
			children: "an inline ",
			inline: true,
		},
		"text-end": {
			uiType: "text-body",
			children: "text",
			inline: true,
		},
	},
};

export const ParagraphText = Template("text-paragraph").bind({});
ParagraphText.args = {
	uiType: "text-body",
	children: {
		"text-paragraph-one": {
			uiType: "text-body",
			children: "This is the first paragraph",
			paragraph: true,
		},
		"text-paragraph-two": {
			uiType: "text-body",
			children: "This is the second paragraph",
			paragraph: true,
		},
		"text-paragraph-three": {
			uiType: "text-body",
			children: "This is the third paragraph",
			paragraph: true,
		},
	},
};

export const HTMLString = Template("text-html-string").bind({});
HTMLString.args = {
	uiType: "text-body",
	children: "<p>his is a paragraph in a HTML string</p>",
};

export const ImageTextString = Template("image-text-string").bind({});
ImageTextString.args = {
	uiType: "text-body",
	children:
		"<img src='https://assets.life.gov.sg/lifesg/logo-lifesg.svg'> <p>The image above is added via img tag and this text is rendered in a p tag</p>",
};

export const SanitizedHTMLString = Template("text-sanitized-html-string").bind({});
SanitizedHTMLString.args = {
	uiType: "text-body",
	children: "<p>This component should not contain a script tag<script>console.log('hello world')</script></p>",
};

export const LongTextWithViewMoreButton = Template("text-array").bind({});
LongTextWithViewMoreButton.args = {
	uiType: "text-body",
	children: ["This", "is", "a", "long", "text"],
	maxLines: 3,
};
