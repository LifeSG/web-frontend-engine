import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { ITextbodySchema } from "../../../components/elements/textbody";
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

export const ArrayOfText = Template.bind({});
ArrayOfText.args = {
	"textbody-array": {
		fieldType: "textbody",
		children: ["This", "is", "an", "array", "of", "text"],
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
							children: "This is the first paragraph",
							paragraph: true,
						},
						"textbody-paragraph-two": {
							fieldType: "textbody",
							children: "This is the second paragraph",
							paragraph: true,
						},
					},
				},
			},
		}}
	/>
);
