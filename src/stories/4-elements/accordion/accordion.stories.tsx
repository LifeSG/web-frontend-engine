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
		children: {
			description: "Elements that are the descendant of this component",
			table: {
				type: { summary: "TFrontendEngineFieldSchema" },
			},
			type: { name: "object", value: {}, required: true },
		},
		button: {
			description:
				"<div>Define button-related settings.</div><ul><li><strong>label</strong>: Label of the button (Default: Edit)</li></ul>",
			table: {
				type: {
					summary: "{ label: string }",
				},
				defaultValue: { summary: "{ label: 'Edit' }" },
			},
		},
		collapsible: {
			description: "Specifies if the contents can be collapsed or expanded",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			control: {
				type: "boolean",
			},
		},
		expanded: {
			description: "Specifies if the component is to be unfolded to reveal the items",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: true },
			},
			control: {
				type: "boolean",
			},
		},
		title: {
			description: "A name of the purpose of the element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		displayState: {
			description: "Specifies the display state which renders an icon",
			table: {
				type: {
					summary: `"default" | "error" | "warning" | undefined"`,
				},
			},
			options: ["default", "error", "warning", "undefined"],
			control: {
				type: "select",
			},
		},
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
			validation: [{ required: true }],
		},
		text2: {
			uiType: "text-field",
			label: "Text 2",
			validation: [{ required: true }],
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
			validation: [{ required: true }],
		},
		checkbox: {
			label: "Checkbox",
			uiType: "checkbox",
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Boy" },
			],
			validation: [{ required: true }],
		},
	},
	button: false,
	collapsible: true,
	title: "Title",
};

export const Button = DefaultStoryTemplate<IAccordionSchema>("accordion-default").bind({});
Button.args = {
	uiType: "accordion",
	children: {
		text: {
			uiType: "text-field",
			label: "Text",
			validation: [{ required: true }],
		},
		checkbox: {
			label: "Checkbox",
			uiType: "checkbox",
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Boy" },
			],
			validation: [{ required: true }],
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
			validation: [{ required: true }],
		},
		checkbox: {
			label: "Checkbox",
			uiType: "checkbox",
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Boy" },
			],
			validation: [{ required: true }],
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
			validation: [{ required: true }],
		},
		checkbox: {
			label: "Checkbox",
			uiType: "checkbox",
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Boy" },
			],
			validation: [{ required: true }],
		},
	},
	button: false,
	displayState: "warning",
	collapsible: false,
	title: "Title",
};
