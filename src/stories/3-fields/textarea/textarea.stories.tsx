import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ITextareaSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/Textarea",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Textarea</Title>
					<p>A form element that renders a multi-line textarea component with optional suggestion pills.</p>
					<p>
						This schema also inherits the
						<a
							href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement"
							target="_blank"
							rel="noopener noreferrer"
						>
							HTMLTextAreaElement
						</a>{" "}
						attributes.
					</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("textarea"),
		chipTexts: {
			description: "Adds clickable suggestion pills",
			table: {
				type: {
					summary: "string[]",
				},
			},
			type: { name: "object", value: {} },
		},
		chipPosition: {
			description: "Whether the chips will appear above or below the textarea",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "top" },
			},
			control: {
				type: "select",
			},
			options: ["top", "bottom"],
		},
		resizable: {
			description: "Toggle vertical resize handler in textarea",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
			},
			control: {
				type: "boolean",
			},
		},
		rows: {
			description: "Visible height of a text area, in lines (Inherited from HTMLTextAreaElement)",
			table: {
				type: {
					summary: "number",
				},
				defaultValue: { summary: "1" },
			},
			type: { name: "number" },
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<ITextareaSchema>("textarea-default").bind({});
Default.args = {
	uiType: "textarea",
	label: "Textarea",
};

export const DefaultValue = DefaultStoryTemplate<ITextareaSchema>("textarea-default-value").bind({});
DefaultValue.args = {
	uiType: "textarea",
	label: "Textarea",
	defaultValues: "This is the default value",
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};

export const LabelCustomisation = DefaultStoryTemplate<ITextareaSchema>("textarea-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "textarea",
	label: {
		mainLabel: "Textfield <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
};

export const AllowResize = DefaultStoryTemplate<ITextareaSchema>("textarea-allow-resize").bind({});
AllowResize.args = {
	uiType: "textarea",
	label: "Resizable textarea",
	resizable: true,
	rows: 3,
};

export const WithCounter = DefaultStoryTemplate<ITextareaSchema>("textarea-with-counter").bind({});
WithCounter.args = {
	uiType: "textarea",
	label: "Textarea with counter",
	validation: [{ max: 5 }],
};

export const WithPills = DefaultStoryTemplate<ITextareaSchema>("textarea-with-pills").bind({});
WithPills.args = {
	uiType: "textarea",
	label: "Textarea with pills",
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
};

export const WithPillsBottom = DefaultStoryTemplate<ITextareaSchema>("textarea-with-pills-bottom").bind({});
WithPillsBottom.storyName = "With Pills (Bottom)";
WithPillsBottom.args = {
	uiType: "textarea",
	label: "Textarea with pills at the bottom",
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
	chipPosition: "bottom",
};

export const WithValidation = DefaultStoryTemplate<ITextareaSchema>("textarea-with-validation").bind({});
WithValidation.args = {
	uiType: "textarea",
	label: "Textarea with validation",
	validation: [{ required: true }, { min: 3, errorMessage: "Min. 3 characters" }],
};

export const Warning = WarningStoryTemplate<ITextareaSchema>("textarea-with-warning").bind({});
Warning.args = {
	uiType: "textarea",
	label: "Textarea with validation",
};

export const WithPlaceholder = DefaultStoryTemplate<ITextareaSchema>("textarea-with-placeholder").bind({});
WithPlaceholder.args = {
	uiType: "textarea",
	label: "Textarea with placeholder",
	placeholder: "Enter something...",
};

export const Reset = ResetStoryTemplate<ITextareaSchema>("textarea-reset").bind({});
Reset.args = {
	uiType: "textarea",
	label: "Textarea",
};

export const ResetWithDefaultValues = ResetStoryTemplate<ITextareaSchema>("textarea-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	uiType: "textarea",
	label: "Textarea",
	defaultValues: "This is the default value",
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};

export const Overrides = OverrideStoryTemplate<ITextareaSchema>("textarea-overrides").bind({});
Overrides.args = {
	uiType: "textarea",
	label: "Textarea",
	overrides: {
		label: "Overridden",
		resizable: true,
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
