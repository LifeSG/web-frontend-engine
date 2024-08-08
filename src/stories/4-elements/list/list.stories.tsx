import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IOrderedListSchema, IUnorderedListSchema } from "../../../components/elements";
import { CommonFieldStoryProps, FrontendEngine } from "../../common";

const meta: Meta = {
	title: "Element/List",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>List</Title>
					<p>
						This component renders a `TextList.Ol` or `TextList.Ul` component provided by the Design System
						within a Frontend Engine generated form
					</p>

					<p>
						Please refer to the{" "}
						<a
							href="https://designsystem.life.gov.sg/react/index.html?path=/docs/general-textlist--docs"
							target="_blank"
							rel="noopener noreferrer"
						>
							design system
						</a>{" "}
						for the properties of `TextList`
					</p>
					<ArgTypes of={OrderedList} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("list", true),
		uiType: {
			description: "The type of list to be rendered",
			table: {
				type: {
					summary: `"ordered-list" | "unordered-list"`,
				},
			},
			options: ["ordered-list", "unordered-list"],
			control: {
				type: "select",
			},
		},
		children: {
			description: "The items of the list component",
			type: {
				name: "array",
				value: { name: "string" },
				required: true,
			},
			table: {
				type: {
					summary: "(string | Record<string, IListItemSchema>)[]",
				},
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
	)) as StoryFn<IOrderedListSchema | IUnorderedListSchema>;

export const OrderedList = Template("list-ordered").bind({});
OrderedList.args = {
	uiType: "ordered-list",
	children: ["Item one", "Item two with <strong>bold</strong> text"],
};

export const NestedOrderedList = Template("list-nested-ordered").bind({});
NestedOrderedList.args = {
	uiType: "ordered-list",
	children: [
		"Item one",
		{
			listItem: {
				uiType: "list-item",
				children: {
					text: {
						uiType: "text-body",
						children: "Item with list",
					},
					list: {
						uiType: "ordered-list",
						counterType: "lower-alpha",
						counterSeparator: ".",
						children: ["Nested item one", "Nested item two with <strong>bold</strong> text"],
					},
				},
			},
		},
	],
};

export const UnorderedList = Template("list-unordered").bind({});
UnorderedList.args = {
	uiType: "unordered-list",
	children: ["Item one", "Item two with <strong>bold</strong> text"],
};

export const NestedUnorderedList = Template("list-nested-unordered").bind({});
NestedUnorderedList.args = {
	uiType: "unordered-list",
	children: [
		"Item one",
		{
			listItem: {
				uiType: "list-item",
				children: {
					text: {
						uiType: "text-body",
						children: "Item with list",
					},
					list: {
						uiType: "unordered-list",
						bulletType: "circle",
						children: ["Nested item one", "Nested item two with <strong>bold</strong> text"],
					},
				},
			},
		},
	],
};
