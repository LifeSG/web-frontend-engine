import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { ITextbodySchema } from "../../../components/elements/text-body";
import { CommonFieldStoryProps, ExcludeReactFormHookProps } from "../../common";

export default {
	title: "Element/TextBody",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TextBody</Title>
					<Description>
						This component renders a `Text.Body` component provided by the Design System within a Frontend
						Engine generated form
					</Description>
					<Heading>Props</Heading>
					<Description>
						Please refer to the [design
						system](https://designsystem.life.gov.sg/react/index.html?path=/docs/general-text-introduction--introduction)
						for the properties of `Text.Body`
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("textbody", true),
		children: {
			type: {
				name: "string",
				required: true,
			},
			description: "The content of the textbody component",
			table: {
				type: {
					summary: "string | string[] | Record<string, ITextbodySchema>",
				},
			},
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

const Template: Story<Record<string, ITextbodySchema>> = (args) => <FrontendEngine data={{ fields: { ...args } }} />;

export const Default = Template.bind({});
Default.args = {
	"textbody-default": {
		fieldType: "textbody",
		children: "Default text body",
	},
};

export const BoldText = Template.bind({});
BoldText.args = {
	"textbody-bold": {
		fieldType: "textbody",
		children: "Bold text body",
		weight: "bold",
	},
};

export const SemiBoldText = Template.bind({});
SemiBoldText.args = {
	"textbody-semibold": {
		fieldType: "textbody",
		children: "Semibold text body",
		weight: "semibold",
	},
};

export const ArrayOfPlainText = Template.bind({});
ArrayOfPlainText.args = {
	"textbody-array-plain": {
		fieldType: "textbody",
		children: ["This", "is", "an", "array", "of", "text"],
	},
};

export const ArrayOfPlainAndStyledText = Template.bind({});
ArrayOfPlainAndStyledText.args = {
	"textbody-array-plain-styled": {
		fieldType: "textbody",
		children: ["This", "<mark>is</mark>", "<u>a</u>", "<strong>styled</strong>", "<i>sentence</i>"],
	},
};

export const InlineText = () => (
	<FrontendEngine
		data={{
			fields: {
				"textbody-inline": {
					fieldType: "textbody",
					children: {
						"textbody-start": {
							fieldType: "textbody",
							children: "This is ",
							inline: true,
						},
						"textbody-body": {
							fieldType: "textbody",
							children: "an inline ",
							inline: true,
						},
						"textbody-end": {
							fieldType: "textbody",
							children: "text",
							inline: true,
						},
					},
				},
			},
		}}
	/>
);

export const ParagraphText = () => (
	<FrontendEngine
		data={{
			fields: {
				"textbody-paragraph": {
					fieldType: "textbody",
					children: {
						"textbody-paragraph-one": {
							fieldType: "textbody",
							children: "<strong>This is the first paragraph</strong>",
							paragraph: true,
						},
						"textbody-paragraph-two": {
							fieldType: "textbody",
							children: "This is the second paragraph",
							paragraph: true,
						},
						"textbody-paragraph-three": {
							fieldType: "textbody",
							children: "<i>This is the third paragraph</i>",
							paragraph: true,
						},
					},
				},
			},
		}}
	/>
);

export const HTMLString = () => (
	<FrontendEngine
		data={{
			fields: {
				"textbody-html-string": {
					fieldType: "textbody",
					children: `<p>This is a paragraph in a HTML string</p>`,
				},
			},
		}}
	/>
);
