import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IChipsSchema } from "../../../components/fields/chips";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	FrontendEngine,
	RESET_BUTTON_SCHEMA,
	ResetStoryTemplate,
	SUBMIT_BUTTON_SCHEMA,
} from "../../common";
import { IFrontendEngineRef } from "../../../components";
import { useRef } from "react";

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

export const Default = DefaultStoryTemplate<IChipsSchema>("chips-default").bind({});
Default.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const DefaultValue = DefaultStoryTemplate<IChipsSchema, string[]>("chips-default-value").bind({});
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

export const DefaultTextareaValue: Story<IChipsSchema> = (args) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						"chips-textarea-default": args,
						buttons: {
							uiType: "div",
							style: { display: "flex", gap: "1rem" },
							children: {
								...SUBMIT_BUTTON_SCHEMA,
							},
						},
					},
				},
			},
			defaultValues: {
				"chips-textarea-default": ["Durian"],
				"chips-textarea-default-textarea": "Hello world",
			},
		}}
	/>
);
DefaultTextareaValue.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	textarea: { label: "Durian", rows: 1 },
};

export const DisabledOptions = DefaultStoryTemplate<IChipsSchema>("chips-disabled-options").bind({});
DisabledOptions.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple", disabled: true },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry", disabled: true },
	],
};

export const Disabled = DefaultStoryTemplate<IChipsSchema>("chips-disabled").bind({});
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

export const WithValidation = DefaultStoryTemplate<IChipsSchema>("chips-with-validation").bind({});
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

export const WithTextarea = DefaultStoryTemplate<IChipsSchema>("chips-with-textarea").bind({});
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

export const WithTextareaValidation = DefaultStoryTemplate<IChipsSchema>("chips-with-textarea-validation").bind({});
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

export const WithResizableTextarea = DefaultStoryTemplate<IChipsSchema>("chips-with-textarea-resizable").bind({});
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

export const WithTextareaCustomRows = DefaultStoryTemplate<IChipsSchema>("chips-with-textarea-custom-rows").bind({});
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

export const WithTextareaMaxLength = DefaultStoryTemplate<IChipsSchema>("chips-with-textarea-max-length").bind({});
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

export const SingleSelection = DefaultStoryTemplate<IChipsSchema>("chips-single-selection").bind({});
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

export const Reset = ResetStoryTemplate<IChipsSchema>("chips-reset").bind({});
Reset.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const ResetWithDefaultValues = ResetStoryTemplate<IChipsSchema, string[]>("chips-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: ["Apple", "Berry"],
};
ResetWithDefaultValues.argTypes = {
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

export const ResetWithTextarea: Story<IChipsSchema> = (args) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						"chips-textarea-reset": args,
						buttons: {
							uiType: "div",
							style: { display: "flex", gap: "1rem" },
							children: {
								...RESET_BUTTON_SCHEMA,
								...SUBMIT_BUTTON_SCHEMA,
							},
						},
					},
				},
			},
			defaultValues: {
				"chips-textarea-reset": ["Durian"],
				"chips-textarea-reset-textarea": "Hello world",
			},
		}}
	/>
);
ResetWithTextarea.args = {
	uiType: "chips",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	textarea: { label: "Durian", rows: 1 },
};
