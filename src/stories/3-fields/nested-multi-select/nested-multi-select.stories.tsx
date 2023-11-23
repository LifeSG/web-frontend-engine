import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IL1Option, INestedMultiSelectSchema } from "../../../components/fields";
import { CommonFieldStoryProps, DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Field/NestedMultiSelect",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>NestedMultiSelect</Title>
					<Description>
						This component provides a set of options for user to select multiple preferences
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("nested-multi-select"),
		disabled: {
			description: "Specifies if the input should be disabled",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		options: {
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "{ label: string, value: string }[]",
				},
			},
			type: { name: "object", value: {} },
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		listStyleWidth: {
			description: "Style option: The width of the options. You can specify e.g. 100% or 12rem",
			table: {
				type: {
					summary: "string",
				},
			},
		},
	},
};
export default meta;

export const options: IL1Option[] = [
	{
		label: "Category 1",
		value: "category 1",
		subItems: [
			{
				label: "Sub Category A",
				value: "sub category a",
				subItems: [
					{
						label: "Option 1",
						value: "option-1",
					},
					{
						label: "Option 2",
						value: "option-2",
					},
					{
						label: "Option 3",
						value: "option-3",
					},
				],
			},
			{
				label: "Sub Category B",
				value: "sub category b",
				subItems: [
					{
						label: "Option ",
						value: "sub option 2",
					},
				],
			},
			{
				label: "Sub Category C",
				value: "sub category c",
				subItems: [
					{
						label: "Honey",
						value: "honey",
					},
					{
						label: "Nuts",
						value: "nuts",
					},
					{
						label: "Butter",
						value: "butter",
					},
				],
			},
			{
				label: "Option with no subcategory",
				value: "Option with no subcategory",
			},
		],
	},
];

export const Default = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-default").bind({});
Default.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	enableSearch: true,
	options: options,
};
