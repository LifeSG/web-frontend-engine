import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { INestedMultiSelectOption, INestedMultiSelectSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";
import { L1OptionProps } from "@lifesg/react-design-system";

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

const hardcodedOptions = [
	{
		label: "Category 1",
		value: { id: 999, name: "category 1" },
		key: "999",
		subItems: [
			{
				label: "Sub Category A",
				value: {
					id: 820,
					name: "Sub category a",
				},
				key: "820",
				subItems: [
					{
						label: "Option 1",
						value: {
							id: 10001,
							name: "Option-1",
						},
						key: "10001",
					},
					{
						label: "Option 2",
						value: {
							id: 10002,
							name: "Option-2",
						},
						key: "10002",
					},
					{
						label: "Option 3",
						value: {
							id: 10003,
							name: "Option-3",
						},
						key: "10003",
					},
				],
			},
			{
				label: "Sub Category B",
				value: { id: 821, name: "Sub category b" },
				key: "821",
				subItems: [
					{
						label: "Option ",
						value: {
							id: 103,
							name: "Sub option 2",
						},
						key: "103",
					},
				],
			},
			{
				label: "Sub Category C",
				value: {
					id: 822,
					name: "Sub category c",
				},
				key: "822",
				subItems: [
					{
						label: "Honey",
						value: {
							id: 104,
							name: "honey",
						},
						key: "104",
					},
					{
						label: "Nuts",
						value: {
							id: 105,
							name: "nuts",
						},
						key: "105",
					},
					{
						label: "Butter",
						value: {
							id: 106,
							name: "butter",
						},
						key: "106",
					},
				],
			},
			{
				label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sollicitudin dolor ut est rutrum vulputate. Maecenas lacinia viverra metus",
				value: {
					id: 510,
					name: "Long sub category a",
				},
				key: "510",
				subItems: [
					{
						label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempor varius elit nec iaculis. Sed sed mauris iaculis, pretium dui vel, lacinia est.",
						value: {
							id: 23,
							name: "Long item a",
						},
						key: "23",
					},
				],
			},
		],
	},
	{
		label: "Hive",
		value: { id: 487, name: "hive" },
		key: "32",
		subItems: [
			{
				label: "Level 8",
				value: { id: 100, name: "Level 8" },
				key: "100",
			},
			{
				label: "Level 9 ",
				value: { id: 101, name: "Level 9" },
				key: "101",
				subItems: [
					{
						label: "Tutu kueh",
						value: {
							id: 900,
							name: "tutu kueh",
						},
						key: "900",
					},
					{
						label: "Lychee",
						value: {
							id: 901,
							name: "lychee",
						},
						key: "901",
					},
					{
						label: "Mao Shan Wang",
						value: {
							id: 902,
							name: "mao shan wang",
						},
						key: "902",
					},
				],
			},
			{
				label: "Base",
				value: { id: 102, name: "Earth" },
				key: "102",
				subItems: [
					{
						label: "Uranus",
						value: {
							id: 903,
							name: "Uranus",
						},
						key: "903",
					},
					{
						label: "Neptune",
						value: {
							id: 904,
							name: "Neptune",
						},
						key: "904",
					},
				],
			},
		],
	},
];

export const Default = DefaultStoryTemplate<INestedMultiSelectSchema>("nested-multi-select-default").bind({});
Default.args = {
	uiType: "nested-multi-select",
	label: "Fruits",
	// options: hardcodedOptions,
};
