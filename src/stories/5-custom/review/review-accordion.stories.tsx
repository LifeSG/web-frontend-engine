import { UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section";
import { action } from "@storybook/addon-actions";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useEffect, useRef } from "react";
import { IFrontendEngineRef } from "../../../components";
import { TReviewSchema } from "../../../components/custom/review";
import { CommonCustomStoryProps, DefaultStoryTemplate, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

const meta: Meta = {
	title: "Custom/Review/Accordion",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Review (Accordion Variant)</Title>
					<Description>
						Displays data fields and information in an accordion, this is typically used for review
						purposes.
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("review"),
		variant: {
			description: "Use `accordion` to show this field",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string" },
			options: ["accordion"],
			control: {
				type: "select",
			},
		},
		label: {
			description: "A name of the purpose of the element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		items: {
			type: { name: "object", value: {}, required: true },
			description:
				"<div>The items to be displayed. Items are displayed in a label and value format.</div><ul><li><strong>label</strong>: Label of the uneditable item</li><li><strong>value</strong>: Value of the uneditable item</li><li><strong>displayWidth</strong>: Width that the item can span across the entire section.<br><strong>Mask</strong>: Conceal value by replacing specific portions with a dot (•) according to the mask type provided.</li></ul>",
			table: {
				type: {
					summary: "{ label: string, value: string, displayWidth?: half|full, mask?: uinfin|whole }",
				},
				defaultValue: { summary: null },
			},
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
	},
};
export default meta;

const SAMPLE_ITEMS: UneditableSectionItemProps[] = [
	{
		label: "Name (as in NRIC or passport)",
		value: "Tom Tan Li Ho",
		displayWidth: "half",
	},
	{
		label: "Date of birth",
		value: "6 November 1992",
	},
	{
		label: "Ethnicity",
		value: "Chinese",
	},
	{
		label: "Spoken Language",
		value: "English, Mandarin, French",
	},
	{
		label: "Residential Address",
		value: "Block 287, #05-11, Tampines street 22, Singapore 534788",
		displayWidth: "full",
	},
];

/* eslint-disable react-hooks/rules-of-hooks */
const EventTemplate = (eventName: string) =>
	((args) => {
		const id = `review-accordion-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();
		const handleEvent = (e: unknown) => action(eventName)(e);
		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(eventName, id, handleEvent);
			return () => currentFormRef.removeFieldEventListener(eventName, id, handleEvent);
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
	}) as StoryFn<TReviewSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const Default = DefaultStoryTemplate<TReviewSchema>("review-default").bind({});
Default.args = {
	referenceKey: "review",
	variant: "accordion",
	label: "Your personal information",
	items: SAMPLE_ITEMS,
};

export const Masking = DefaultStoryTemplate<TReviewSchema>("review-masking").bind({});
Masking.args = {
	referenceKey: "review",
	variant: "accordion",
	label: "Your personal information",
	items: [
		{
			label: "Name (as in NRIC or passport)",
			value: "Tom Tan Li Ho",
			displayWidth: "half",
		},
		{
			label: "NRIC",
			value: "S1234567D",
			displayWidth: "half",
			mask: "uinfin",
		},
		{
			label: "Sensitive info",
			value: "Something sensitive",
			displayWidth: "half",
			mask: "whole",
		},
	],
};

export const NotCollapsible = DefaultStoryTemplate<TReviewSchema>("review-button-collapsible").bind({});
NotCollapsible.args = {
	referenceKey: "review",
	variant: "accordion",
	label: "Your personal information",
	items: SAMPLE_ITEMS,
	collapsible: false,
};

export const Collapsed = DefaultStoryTemplate<TReviewSchema>("review-button-collapsed").bind({});
Collapsed.args = {
	referenceKey: "review",
	variant: "accordion",
	label: "Your personal information",
	items: SAMPLE_ITEMS,
	expanded: false,
};

export const ButtonLabel = DefaultStoryTemplate<TReviewSchema>("review-button-label").bind({});
ButtonLabel.args = {
	referenceKey: "review",
	variant: "accordion",
	label: "Your personal information",
	items: SAMPLE_ITEMS,
	button: { label: "Modify" },
};

export const ButtonHidden = DefaultStoryTemplate<TReviewSchema>("review-button-hidden").bind({});
ButtonHidden.args = {
	referenceKey: "review",
	variant: "accordion",
	label: "Your personal information",
	items: SAMPLE_ITEMS,
	button: false,
};

export const MountEvent = EventTemplate("mount").bind({});
MountEvent.args = {
	referenceKey: "review",
	variant: "accordion",
	label: "Your personal information",
	items: SAMPLE_ITEMS,
};

export const ButtonClickEvent = EventTemplate("edit").bind({});
ButtonClickEvent.args = {
	referenceKey: "review",
	variant: "accordion",
	label: "Your personal information",
	items: SAMPLE_ITEMS,
};
