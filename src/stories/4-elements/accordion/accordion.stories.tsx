import { action } from "@storybook/addon-actions";
import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useEffect, useRef } from "react";
import { IFrontendEngineRef } from "../../../components";
import { IAccordionSchema } from "../../../components/elements/accordion/types";
import { CommonFieldStoryProps, DefaultStoryTemplate, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

const meta: Meta = {
	title: "Element/Accordion",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Accordion</Title>
					<p>
						Wrapping component that must be rendered as a direct descendant of <code>accordion</code>{" "}
						uiType.
					</p>
					<ArgTypes of={Default} />
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
				"<div>Define button-related settings.</div><ul><li><strong>label</strong>: Label of the button (Default: Edit)</li></ul>. Render default `Edit` with value true and false | undefined to hide the button",
			table: {
				type: {
					summary: "true | false | { label: string } | undefined",
				},
				defaultValue: { summary: "boolean | { label: 'Edit' }" },
			},
		},
		collapsible: {
			description: "Specifies if the contents can be collapsed or expanded",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "true" },
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
				defaultValue: { summary: "true" },
			},
			control: {
				type: "boolean",
			},
		},
		title: {
			description:
				"A name of the purpose of the element. Also accepts <code>Text</code>, <code>Popover</code> or <code>span</code> schemas",
			table: {
				type: {
					summary: "string | ITextSchema | IPopoverSchema | IInlineWrapperSchema",
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
		disableContentInset: {
			description: "Specifies if there is spacing between content and the edges of the accordion box",
			table: {
				type: {
					summary: "boolean",
				},
			},
			control: {
				type: "boolean",
			},
		},
	},
};
export default meta;

const EventTemplate = <T, U = string>(id: string, eventName: string) =>
	((args) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const formRef = useRef<IFrontendEngineRef>();

		const handleEvent = (e: unknown) => action(eventName)(e);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener("accordion", eventName as any, id, handleEvent);
			return () => currentFormRef.removeFieldEventListener("accordion", eventName as any, id, handleEvent);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<FrontendEngine
				ref={formRef}
				data={{
					sections: {
						section: {
							uiType: "section",
							children: {
								[id]: args,
								...SUBMIT_BUTTON_SCHEMA,
							},
						},
					},
				}}
			/>
		);
	}) as StoryFn<IAccordionSchema>;

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

export const CustomTitle = DefaultStoryTemplate<IAccordionSchema>("accordion-default").bind({});
CustomTitle.args = {
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
	title: {
		text: {
			uiType: "text-h4",
			weight: "semibold",
			children: "Custom&nbsp;",
		},
		span: {
			uiType: "span",
			children: "title",
		},
		popover: {
			hint: {
				content: "this is a custom title",
			},
			icon: "ICircleFillIcon",
			uiType: "popover",
		},
	},
};

export const Collapsible = DefaultStoryTemplate<IAccordionSchema>("accordion-collapsible").bind({});
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

export const Button = EventTemplate<IAccordionSchema>("accordion-button", "edit").bind({});
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
	title: "Accordion With Default Button",
};

export const CustomButton = EventTemplate<IAccordionSchema>("accordion-button-label", "edit").bind({});
CustomButton.args = {
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
	title: "Accordion With Custom Button Label",
};

export const DisplayState = DefaultStoryTemplate<IAccordionSchema>("accordion-display-state").bind({});
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

export const DisableContentInset = DefaultStoryTemplate<IAccordionSchema>("accordion-content-inset").bind({});
DisableContentInset.args = {
	uiType: "accordion",
	children: {
		text1: {
			uiType: "text-body",
			children: "Section one",
			style: { margin: "1rem 2rem" },
		},
		divider: {
			uiType: "divider",
		},
		text2: {
			uiType: "text-body",
			children: "Section two",
			style: { margin: "1rem 2rem" },
		},
	},
	button: false,
	collapsible: false,
	title: "Title",
	disableContentInset: true,
};
