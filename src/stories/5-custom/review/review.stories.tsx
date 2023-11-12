import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IReviewSchema } from "../../../components/custom/review";
import { CommonCustomStoryProps, DefaultStoryTemplate } from "../../common";
import { UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section";

const meta: Meta = {
	title: "Custom/Review",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Review</Title>
					<Description>
						Displays data fields and information that cannot be edited, this is typically used for review
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
				"<div>The uneditable items to be displayed. Items are displayed in a label and value format.</div><ul><li><strong>label</strong>: Label of the uneditable item</li><li><strong>value</strong>: Value of the uneditable item</li><li><strong>displayWidth</strong>: Width that the item can span across the entire section.</li></ul>",
			table: {
				type: {
					summary: "{ label: string, value: string, displayWidth?: half|full }",
				},
				defaultValue: { summary: null },
			},
		},
		topSection: {
			type: { name: "object", value: {} },
			description: "A custom section that can be rendered above the main uneditable items section",
			table: {
				type: {
					summary: "Record<string, TReviewSectionChildren>",
				},
			},
		},
		bottomSection: {
			type: { name: "object", value: {} },
			description: "A custom section that can be rendered below the main uneditable items section",
			table: {
				type: {
					summary: "Record<string, TReviewSectionChildren>",
				},
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
		label: "Residential Address",
		value: "Block 287, #05-11, Tampines street 22, Singapore 534788",
		displayWidth: "half",
	},
	{
		label: "Ethnicity",
		value: "Chinese",
	},
];

export const Default = DefaultStoryTemplate<IReviewSchema>("review-default").bind({});
Default.args = {
	referenceKey: "review",
	label: "Your personal information",
	description: "Retrieved on 27 Jun 2023",
	items: SAMPLE_ITEMS,
	variant: "box",
};
export const AccordionVariant = DefaultStoryTemplate<IReviewSchema>("review-default").bind({});
AccordionVariant.args = {
	referenceKey: "review",
	label: "Your personal information",
	items: SAMPLE_ITEMS,
	variant: "accordion",
};

export const CustomTopSection = DefaultStoryTemplate<IReviewSchema>("review-default").bind({});
CustomTopSection.args = {
	referenceKey: "review",
	label: "Your personal information",
	description: "Retrieved on 27 Jun 2023",
	items: SAMPLE_ITEMS,
	topSection: {
		alert: {
			uiType: "alert",
			type: "warning",
			className: "margin--bottom",
			children: "Sample alert",
		},
	},
};

export const CustomBottomSection = DefaultStoryTemplate<IReviewSchema>("review-default").bind({});
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
