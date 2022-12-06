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
						This component renders a list of selectable chip, with an additional configurable textarea
						component that renders based on the selected chip.
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
		options: {
			description: "A list of text chips for users to select",
			table: {
				type: {
					summary: "string[]",
				},
			},
			type: { name: "object", value: {} },
		},
		textarea: {
			description:
				"Specifies the configuration (including validation rules) for a conditionally rendered <code>textarea</code> component",
			table: {
				type: {
					summary: "{ name: string, validation: IYupValidationRule[] }",
				},
			},
			type: { name: "object", value: {} },
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
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
	},
};

export const DefaultValue = () => (
	<StyledForm
		data={{
			fields: {
				"chips-default-value": {
					fieldType: "chips",
					label: "Fruits",
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
					],
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
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		disabled: true,
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"chips-with-validation": {
		fieldType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		validation: [{ required: true }],
	},
};

export const WithTextArea = Template.bind({});
WithTextArea.args = {
	"chips-with-textarea": {
		fieldType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		textarea: { name: "Durian" },
	},
};

export const WithTextAreaValidation = Template.bind({});
WithTextAreaValidation.args = {
	"chips-with-textarea-validation": {
		fieldType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		textarea: { name: "Durian", validation: [{ required: true }, { min: 3, errorMessage: "Min. 3 characters" }] },
	},
};

export const WithResizableTextArea = Template.bind({});
WithResizableTextArea.args = {
	"chips-with-textarea-resizable": {
		fieldType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		resizable: true,
		textarea: { name: "Durian" },
	},
};

export const WithResizableCustomRows = Template.bind({});
WithResizableCustomRows.args = {
	"chips-with-textarea-custom-rows": {
		fieldType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		rows: 1,
		textarea: { name: "Durian" },
	},
};

export const SingleSelection = Template.bind({});
SingleSelection.args = {
	"chips-single-selection": {
		fieldType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		multi: false,
	},
};
