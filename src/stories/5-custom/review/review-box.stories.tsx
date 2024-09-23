import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { TReviewSchema, TReviewSchemaItem } from "../../../components/custom/review";
import { CommonCustomStoryProps, DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Custom/Review/Box",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Review (Box Variant)</Title>
					<p>Displays data fields and information in a box, this is typically used for review purposes.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("review"),
		variant: {
			description: "Use `box` to show this field",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string" },
			options: ["box"],
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
		description: {
			description: "Extra line of copy underneath the label",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		items: {
			type: { name: "object", value: {}, required: true },
			description:
				"<div>The items to be displayed. Items are displayed in a label and value format.</div><ul><li><strong>label</strong>: Label of the uneditable item</li><li><strong>value</strong>: Value of the uneditable item</li><li><strong>displayWidth</strong>: Width that the item can span across the entire section.<br><strong>mask</strong>: Conceal value by replacing specific portions with a dot (•) according to the mask type provided.</li><li><strong>unmask</strong>: Reveal unmasked value by retrieving from api call</li><li><strong>disableMaskUnmask</strong>: Hides eye icon and prevents mask / unmask of the value</li></ul>",
			table: {
				type: {
					summary:
						"{ label: string, value: string, displayWidth?: half|full, mask?: uinfin|whole, unmask?: { url: string, body: {}, withCredentials?: boolean }, disableMaskUnmask?: boolean }",
				},
				defaultValue: { summary: null },
			},
		},
		topSection: {
			type: { name: "object", value: {} },
			description: "A custom section that can be rendered above the main section",
			table: {
				type: {
					summary: "Record<string, TReviewSectionChildren>",
				},
			},
		},
		bottomSection: {
			type: { name: "object", value: {} },
			description: "A custom section that can be rendered below the main section",
			table: {
				type: {
					summary: "Record<string, TReviewSectionChildren>",
				},
			},
		},
		background: {
			description: "Specifies if a background should be rendered",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: {
					summary: "true",
				},
			},
			control: {
				type: "boolean",
			},
		},
	},
};
export default meta;

const SAMPLE_ITEMS: TReviewSchemaItem[] = [
	{
		label: "Name (as in NRIC or passport)",
		value: "Tom Tan Li Ho",
		displayWidth: "half",
	},
	{
		label: "NRIC or FIN",
		value: "S••••534J",
		displayWidth: "half",
	},
	{
		label: "Date of birth",
		value: "6 November 1992",
		displayWidth: "half",
	},
	{
		label: "Ethnicity",
		value: "Chinese",
		displayWidth: "half",
	},
	{
		label: "Residential Address",
		value: "Block 287, #05-11, Tampines street 22, Singapore 534788",
	},
];

export const Default = DefaultStoryTemplate<TReviewSchema>("review-default").bind({});
Default.args = {
	referenceKey: "review",
	label: "Your personal information",
	description: "Retrieved on 27 Jun 2023",
	items: SAMPLE_ITEMS,
	variant: "box",
};

export const CustomTopSection = DefaultStoryTemplate<TReviewSchema>("review-default").bind({});
CustomTopSection.args = {
	referenceKey: "review",
	label: "Your personal information",
	description: "Retrieved on 27 Jun 2023",
	items: SAMPLE_ITEMS,
	topSection: {
		alert: {
			uiType: "alert",
			type: "warning",
			className: "margin-bottom-1",
			children: "Sample alert",
		},
	},
};

export const CustomBottomSection = DefaultStoryTemplate<TReviewSchema>("review-default").bind({});
CustomBottomSection.args = {
	referenceKey: "review",
	label: "Your personal information",
	description: "Retrieved on 27 Jun 2023",
	items: SAMPLE_ITEMS,
	bottomSection: {
		alert: {
			uiType: "alert",
			type: "warning",
			children: "Sample alert",
		},
	},
};

export const Masking = DefaultStoryTemplate<TReviewSchema>("review-masking").bind({});
Masking.args = {
	referenceKey: "review",
	label: "Your personal information",
	description: "Retrieved on 27 Jun 2023",
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
		{
			label: "Prevent unmasking",
			value: "Something sensitive",
			displayWidth: "half",
			mask: "whole",
			disableMaskUnmask: true,
		},
		{
			label: "Unmask via API",
			value: "S1••••67D",
			displayWidth: "half",
			mask: "uinfin",
			unmask: {
				url: "https://a2fd2c71-5250-49ad-82f1-c63606b81062.mock.pstmn.io/unmask",
				body: {
					serviceId: "serviceId",
					actionId: "actionId",
					fieldId: "fieldId",
				},
			},
		},
		{
			label: "Unmask with API error",
			value: "S1••••67D",
			displayWidth: "half",
			mask: "uinfin",
			unmask: {
				url: "https://invalid.url",
				body: { hello: "world" },
			},
		},
	],
};

export const NoBackground = DefaultStoryTemplate<TReviewSchema>("review-no-background").bind({});
NoBackground.args = {
	referenceKey: "review",
	label: "Your personal information",
	description: "Retrieved on 27 Jun 2023",
	items: SAMPLE_ITEMS,
	background: false,
};
