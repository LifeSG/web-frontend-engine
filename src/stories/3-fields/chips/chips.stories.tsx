import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IChipsSchema } from "../../../components/fields/chips";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, StyledForm, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/Chips",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Chips</Title>
					<Description>
						This component renders a list of selectable chip, with an additional configurable textarea that
						renders based on the selected chip.
					</Description>
					<Heading>Props</Heading>
					<Description>
						This schema also inherits the
						[HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement)
						attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("chips"),
		"chips-default": { table: { disable: true } },
		chipTexts: {
			description: "A list of text chips for users to select",
			table: {
				type: {
					summary: "string[]",
				},
			},
			type: { name: "object", value: {} },
		},
		textAreaChipName: {
			description: "Specifies a chip name that will conditionally renders the text area component",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		showTextAreaChip: {
			description: "Specifies if the text area chip should be rendered",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		isSingleSelection: {
			description: "Specifies if the component only allows single value",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		resizable: {
			description: "Toggle vertical resize handler in textarea",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		maxLength: {
			description:
				"Maximum number of characters that can go into the textarea. (Inherited from HTMLTextAreaElement). This brings up the character counter under the field.",
			table: {
				type: {
					summary: "number",
				},
			},
			type: { name: "number" },
		},
		rows: {
			description: "Visible height of a text area, in lines (Inherited from HTMLTextAreaElement)",
			table: {
				type: {
					summary: "number",
				},
				defaultValue: { summary: 1 },
			},
			defaultValue: 1,
			type: { name: "number" },
		},
	},
} as Meta;

const Template: Story<Record<string, IChipsSchema>> = (args) => (
	<StyledForm
		data={{
			fields: {
				...args,
				...SubmitButtonStorybook,
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"chips-default": {
		fieldType: "chips",
		label: "Fruits",
		chipTexts: ["Apple", "Berry", "Cherry"],
	},
};

export const DefaultValue = () => (
	<StyledForm
		data={{
			fields: {
				"chips-default-value": {
					fieldType: "chips",
					label: "Fruits",
					chipTexts: ["Apple", "Berry", "Cherry"],
				},
				...SubmitButtonStorybook,
			},
			defaultValues: {
				"chips-default-value": ["Apple", "Berry"],
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"chips-disabled": {
		fieldType: "chips",
		label: "Fruits",
		chipTexts: ["Apple", "Berry", "Cherry"],
		disabled: true,
	},
};

export const WithTextArea = Template.bind({});
WithTextArea.args = {
	"chips-with-textarea": {
		fieldType: "chips",
		label: "Fruits",
		chipTexts: ["Apple", "Berry", "Cherry"],
		textAreaChipName: "Durian",
		showTextAreaChip: true,
	},
};

export const SingleSelection = Template.bind({});
SingleSelection.args = {
	"chips-single-selection": {
		fieldType: "chips",
		label: "Fruits",
		chipTexts: ["Apple", "Berry", "Cherry"],
		isSingleSelection: true,
	},
};
