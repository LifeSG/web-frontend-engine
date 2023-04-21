import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IChipsSchema } from "../../../components/fields/chips";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

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
		...CommonFieldStoryProps("chips"),
		options: {
			description:
				"A list of options that a user can choose from. Component <code>disabled</code> will take precedence over option <code>disabled</code>",
			table: {
				type: {
					summary: "{label: string, value: string, disabled?: boolean}[]",
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
		disabled: {
			description: "Specifies if the chips should be disabled",
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
	},
} as Meta;

const Template = (id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
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
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as Story<IChipsSchema & { defaultValues?: string[] | undefined }>;

export const Default = Template("chips-default").bind({});
Default.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const DefaultValue = Template("chips-default-value").bind({});
DefaultValue.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: ["Apple", "Berry"],
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string[]",
			},
		},
		type: { name: "object", value: {} },
	},
};

export const DisabledOptions = Template("chips-disabled-options").bind({});
DisabledOptions.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple", disabled: true },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry", disabled: true },
	],
};

export const Disabled = Template("chips-disabled").bind({});
Disabled.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	disabled: true,
};

export const WithValidation = Template("chips-with-validation").bind({});
WithValidation.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	validation: [{ required: true }],
};

export const WithTextarea = Template("chips-with-textarea").bind({});
WithTextarea.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	textarea: { label: "Durian" },
};

export const WithTextareaValidation = Template("chips-with-textarea-validation").bind({});
WithTextareaValidation.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	textarea: { label: "Durian", validation: [{ required: true }, { min: 3, errorMessage: "Min. 3 characters" }] },
};

export const WithResizableTextarea = Template("chips-with-textarea-resizable").bind({});
WithResizableTextarea.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	textarea: { label: "Durian", resizable: true },
};

export const WithTextareaCustomRows = Template("chips-with-textarea-custom-rows").bind({});
WithTextareaCustomRows.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	textarea: { label: "Durian", rows: 1 },
};

export const WithTextareaMaxLength = Template("chips-with-textarea-max-length").bind({});
WithTextareaMaxLength.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	textarea: { label: "Durian", rows: 1, validation: [{ max: 10 }] },
};

export const SingleSelection = Template("chips-single-selection").bind({});
SingleSelection.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	validation: [{ max: 1 }],
};
