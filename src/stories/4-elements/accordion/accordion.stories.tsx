import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IAccordionSchema } from "../../../components/elements/accordion/types";
import { CommonFieldStoryProps, DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Element/Accordion",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Accordion</Title>
					<Description>
						Wrapping component that must be rendered as a direct descendant of `accordion` uiType.
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("accordion", true),
	},
};
export default meta;

export const Default = DefaultStoryTemplate<IAccordionSchema>("accordion-default").bind({});
Default.args = {
	uiType: "accordion",
	children: {
		text: {
			uiType: "text-field",
			label: "Text",
		},
		text2: {
			uiType: "text-field",
			label: "Text 2",
		},
	},
	button: false,
	collapsible: true,
	expanded: true,
	title: "Title",
};

export const Collapsible = DefaultStoryTemplate<IAccordionSchema>("accordion-default").bind({});
Collapsible.args = {
	uiType: "accordion",
	children: {
		text: {
			uiType: "text-field",
			label: "Text",
		},
		checkbox: {
			label: "Checkbox",
			uiType: "checkbox",
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Boy" },
			],
		},
	},
	button: false,
	collapsible: false,
	title: "Title",
};

export const Button = DefaultStoryTemplate<IAccordionSchema>("accordion-default").bind({});
Button.args = {
	uiType: "accordion",
	children: {
		text: {
			uiType: "text-field",
			label: "Text",
		},
		checkbox: {
			label: "Checkbox",
			uiType: "checkbox",
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Boy" },
			],
		},
	},
	button: {
		label: undefined,
	},
	collapsible: false,
	title: "Accordion With Button",
};

export const ButtonLabel = DefaultStoryTemplate<IAccordionSchema>("accordion-default").bind({});
ButtonLabel.args = {
	uiType: "accordion",
	children: {
		text: {
			uiType: "text-field",
			label: "Text",
		},
		checkbox: {
			label: "Checkbox",
			uiType: "checkbox",
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Boy" },
			],
		},
	},
	button: {
		label: "Custom Label",
	},
	collapsible: false,
	title: "Accordion With Button",
};

export const DisplayState = DefaultStoryTemplate<IAccordionSchema>("accordion-default").bind({});
DisplayState.args = {
	uiType: "accordion",
	children: {
		text: {
			uiType: "text-field",
			label: "Text",
		},
		checkbox: {
			label: "Checkbox",
			uiType: "checkbox",
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Boy" },
			],
		},
	},
	button: false,
	displayState: "warning",
	collapsible: false,
	title: "Title",
};
