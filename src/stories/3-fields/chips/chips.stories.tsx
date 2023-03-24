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
					summary: "{ label: string, validation?: IYupValidationRule[], resizable?: boolean, rows?: number }",
				},
			},
			type: { name: "object", value: {} },
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
		uiType: "chips",
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
					uiType: "chips",
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
		uiType: "chips",
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
		uiType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		validation: [{ required: true }],
	},
};

export const WithTextarea = Template.bind({});
WithTextarea.args = {
	"chips-with-textarea": {
		uiType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		textarea: { label: "Durian" },
	},
};

export const WithTextareaValidation = Template.bind({});
WithTextareaValidation.args = {
	"chips-with-textarea-validation": {
		uiType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		textarea: { label: "Durian", validation: [{ required: true }, { min: 3, errorMessage: "Min. 3 characters" }] },
	},
};

export const WithResizableTextarea = Template.bind({});
WithResizableTextarea.args = {
	"chips-with-textarea-resizable": {
		uiType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		textarea: { label: "Durian", resizable: true },
	},
};

export const WithTextareaCustomRows = Template.bind({});
WithTextareaCustomRows.args = {
	"chips-with-textarea-custom-rows": {
		uiType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		textarea: { label: "Durian", rows: 1 },
	},
};

export const WithTextareaMaxLength = Template.bind({});
WithTextareaMaxLength.args = {
	"chips-with-textarea-max-length": {
		uiType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		textarea: { label: "Durian", rows: 1, validation: [{ max: 10 }] },
	},
};

export const SingleSelection = Template.bind({});
SingleSelection.args = {
	"chips-single-selection": {
		uiType: "chips",
		label: "Fruits",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		validation: [{ max: 1 }],
	},
};
