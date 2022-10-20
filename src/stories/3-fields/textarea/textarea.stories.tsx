import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine, ITextareaSchema } from "../../..";
import { ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/TextArea",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TextArea</Title>
					<Description>
						A form element that renders a multi-line textarea component with optional suggestion pills
					</Description>
					<Heading>Props</Heading>
					<Description>
						This schema also inherits the
						[HTMLTextAreaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)
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
		type: {
			description: "Use <code>TEXTAREA</code> to show this field",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: ["TEXTAREA"],
			control: {
				type: "select",
			},
		},
		id: {
			description: "The unique identifier of the component",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			control: {
				type: "text",
			},
		},
		title: {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
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
			defaultValue: "top",
			options: ["top", "bottom"],
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
				"Maximum number of characters that can go into the textarea. (Inherited from HTMLTextAreaElement)",
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
		validation: {
			description:
				"Validation schema, for more info, refer to the respective stories <a href='/docs/form-validation-schema--required'>here</a>",
			table: {
				type: {
					summary: "object",
				},
			},
			type: { name: "object", value: {} },
		},
	},
} as Meta;

const Template: Story<ITextareaSchema> = (args) => (
	<FrontendEngine
		id="frontendEngine"
		validationMode="onSubmit"
		data={{
			fields: [args, SubmitButtonStorybook],
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	type: "TEXTAREA",
	id: "textarea-default",
	title: "Textarea",
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
	type: "TEXTAREA",
	id: "textarea-default-value",
	title: "Textarea",
	defaultValue: "This is a default value",
};

export const AllowResize = Template.bind({});
AllowResize.args = {
	type: "TEXTAREA",
	id: "textarea-allow-resize",
	title: "Resizable textarea",
	resizable: true,
	rows: 3,
};

export const WithCounter = Template.bind({});
WithCounter.args = {
	type: "TEXTAREA",
	id: "textarea-with-counter",
	title: "Textarea with counter",
	maxLength: 5,
};

export const WithPills = Template.bind({});
WithPills.args = {
	type: "TEXTAREA",
	id: "textarea-with-pills",
	title: "Textarea with pills",
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
};

export const WithPillsBottom = Template.bind({});
WithPillsBottom.storyName = "With Pills (Bottom)";
WithPillsBottom.args = {
	type: "TEXTAREA",
	id: "textarea-with-pills-bottom",
	title: "Textarea with pills at the bottom",
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
	chipPosition: "bottom",
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	type: "TEXTAREA",
	id: "textarea-with-validation",
	title: "Textarea with validation",
	validation: [{ required: true }, { min: 3, errorMessage: "Min. 3 characters" }],
};
