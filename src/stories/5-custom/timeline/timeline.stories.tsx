import { ArgTypes, Heading, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ITimelineSchema } from "../../../components/custom/timeline";
import { CommonCustomStoryProps, DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Custom/Timeline",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Timeline</Title>
					<p>Represents the steps of a process in a chronological order.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("timeline"),
		items: {
			type: { name: "object", value: {}, required: true },
			description:
				"<div>The items to be displayed.</div><ul><li><strong>label</strong>: Label of the timeline item.</li><li><strong>content</strong>: Details of the timeline item. Supports HTML text.</li><li><strong>statuses</strong>: The status pills to be rendered. Note that only a maximum of 2 pills will be rendered regardless how many statuses are specified.</li><li><strong>variant</strong>: The style variant of the item indicator.<br>Note: the first item defaults to <code>current</code>, and subsequent items default to <code>upcoming-active</code></li></ul>",
			table: {
				type: {
					summary:
						"{ label: string, content: string, statuses?: [{ icon?: Icons, content: string }], variant?: Variant }",
				},
				defaultValue: { summary: null },
			},
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<ITimelineSchema>("timeline-default", true).bind({});
Default.args = {
	referenceKey: "timeline",
	label: "What's next",
	items: [
		{
			label: "Item 1",
			children: "Just a regular text based item. Lorem ipsum dolor sit amet, consectetur.",
		},
		{
			label: "Item 2",
			children: "An example with a <a href='#'>link</a> and <strong>formatting</strong>.",
		},
		{
			label: "Item 3",
			children: {
				alert: {
					uiType: "alert",
					type: "info",
					children: "This item is rendered from a Frontend Engine schema",
				},
			},
		},
		{
			label: "Item 4",
			children: "Each item accepts up to two pills.",
			statuses: [
				{
					type: "outline",
					colorType: "red",
					icon: "PlusCircleFillIcon",
					children: "Status outline red",
				},
				{
					type: "solid",
					colorType: "blue",
					icon: "PlaceholderIcon",
					children: "Status solid blue",
				},
			],
		},
		{
			label: "Item 5",
			children: "An error variant",
			variant: "error",
		},
	],
};
