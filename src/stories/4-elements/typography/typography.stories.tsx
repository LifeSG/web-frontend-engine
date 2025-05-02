import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { ITypographySchema } from "../../../components/elements";
import { CommonFieldStoryProps, FrontendEngine, LOREM_IPSUM } from "../../common";

const meta: Meta = {
	title: "Element/Typography",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Typography</Title>
					<p>
						This component renders a <code>Typography</code> component provided by the Design System within
						a Frontend Engine generated form.
					</p>
					<p>
						Please refer to the{" "}
						<a
							href="https://designsystem.life.gov.sg/react/index.html?path=/docs/core-typography--docs"
							target="_blank"
							rel="noopener noreferrer"
						>
							design system
						</a>{" "}
						for the properties of <code>Typography</code>.
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
					summary: "string | string[] | Record<string, ITypographySchema>",
				},
			},
		},
		uiType: {
			description: "The type of the text component to be rendered",
			table: {
				type: {
					summary: `
						 "heading-xxl"
						| "heading-xl"
						| "heading-md"
						| "heading-sm"
						| "heading-lg"
						| "heading-xs"
						| "body-md"
						| "body-sm"
						| "body-bl"
						| "body-xs"
					`,
				},
			},
			options: [
				"heading-xxl",
				"heading-xl",
				"heading-md",
				"heading-sm",
				"heading-lg",
				"heading-xs",
				"body-md",
				"body-sm",
				"body-bl",
				"body-xs",
			],
			control: {
				type: "select",
			},
		},
		weight: {
			description: `The weight of the text component.<br>`,
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
	)) as StoryFn<ITypographySchema>;

export const Variants = Template("text-variants").bind({});
Variants.args = {
	uiType: "body-bl",
	children: {
		"heading-xxl": {
			uiType: "heading-xxl",
			children: LOREM_IPSUM("heading-xxl"),
		},
		"heading-xl": {
			uiType: "heading-xl",
			children: LOREM_IPSUM("heading-xl"),
		},
		"heading-lg": {
			uiType: "heading-lg",
			children: LOREM_IPSUM("heading-lg"),
		},
		"heading-md": {
			uiType: "heading-md",
			children: LOREM_IPSUM("heading-md"),
		},
		"heading-sm": {
			uiType: "heading-sm",
			children: LOREM_IPSUM("heading-sm"),
		},
		"heading-xs": {
			uiType: "heading-xs",
			children: LOREM_IPSUM("heading-xs"),
		},
		"body-md": {
			uiType: "body-md",
			children: LOREM_IPSUM("body-md"),
		},
		"body-sm": {
			uiType: "body-sm",
			children: LOREM_IPSUM("body-sm"),
		},
		"body-bl": {
			uiType: "body-bl",
			children: LOREM_IPSUM("body-bl"),
		},
		"body-xs": {
			uiType: "body-xs",
			children: LOREM_IPSUM("body-xs"),
		},
	},
};

export const Weights = Template("text-weights").bind({});
Weights.args = {
	uiType: "body-bl",
	children: {
		default: {
			uiType: "body-bl",
			children: LOREM_IPSUM("Default"),
		},
		bold: {
			uiType: "body-bl",
			children: LOREM_IPSUM("Bold"),
			weight: "bold",
		},
		semibold: {
			uiType: "body-bl",
			children: LOREM_IPSUM("Semibold"),
			weight: "semibold",
		},
		light: {
			uiType: "body-bl",
			children: LOREM_IPSUM("Light"),
			weight: "light",
		},
	},
};

export const ArrayOfText = Template("text-array").bind({});
ArrayOfText.args = {
	uiType: "body-bl",
	children: ["This", "is", "an", "array", "of", "text"],
};

export const ArrayOfStyledText = Template("text-array-plain-styled").bind({});
ArrayOfStyledText.args = {
	uiType: "body-bl",
	children: ["This", "<mark>is</mark>", "<u>a</u>", "<strong>styled</strong>", "<i>sentence</i>"],
};

export const InlineText = Template("text-inline").bind({});
InlineText.args = {
	uiType: "body-bl",
	children: {
		"text-start": {
			uiType: "body-bl",
			children: "This is ",
			inline: true,
		},
		"text-body": {
			uiType: "body-bl",
			children: "an inline ",
			inline: true,
		},
		"text-end": {
			uiType: "body-bl",
			children: "text",
			inline: true,
		},
	},
};

export const ParagraphText = Template("text-paragraph").bind({});
ParagraphText.args = {
	uiType: "body-bl",
	children: {
		"text-paragraph-one": {
			uiType: "body-bl",
			children: "This is the first paragraph",
			paragraph: true,
		},
		"text-paragraph-two": {
			uiType: "body-bl",
			children: "This is the second paragraph",
			paragraph: true,
		},
		"text-paragraph-three": {
			uiType: "body-bl",
			children: "This is the third paragraph",
			paragraph: true,
		},
	},
};

export const HTMLString = Template("text-html-string").bind({});
HTMLString.args = {
	uiType: "body-bl",
	children: "<p>This is a paragraph in a HTML string</p>",
};

export const ImageTextString = Template("image-text-string").bind({});
ImageTextString.args = {
	uiType: "body-bl",
	children:
		"<img src='https://assets.life.gov.sg/lifesg/logo-lifesg.svg'> <p>The image above is added via img tag and this text is rendered in a p tag</p>",
};

export const SanitizedHTMLString = Template("text-sanitized-html-string").bind({});
SanitizedHTMLString.args = {
	uiType: "body-bl",
	children: "<p>This component should not contain a script tag<script>console.log('hello world')</script></p>",
};

export const LongTextWithViewMoreButton = Template("text-array").bind({});
LongTextWithViewMoreButton.args = {
	uiType: "body-bl",
	children: ["This", "is", "a", "long", "text"],
	maxLines: 3,
};
