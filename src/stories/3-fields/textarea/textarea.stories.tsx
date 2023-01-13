import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { ITextareaSchema } from "../../../components/fields";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

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

const Template: Story<Record<string, ITextareaSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	"textarea-default": {
		fieldType: "textarea",
		label: "Textarea",
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"textarea-default-value": {
					fieldType: "textarea",
					label: "Textarea",
				},
				...SubmitButtonStorybook,
			},
			defaultValues: {
				"textarea-default-value": "This is the default value",
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const AllowResize = Template.bind({});
AllowResize.args = {
	"textarea-allow-resize": {
		fieldType: "textarea",
		label: "Resizable textarea",
		resizable: true,
		rows: 3,
	},
};

export const WithCounter = Template.bind({});
WithCounter.args = {
	"textarea-with-counter": {
		fieldType: "textarea",
		label: "Textarea with counter",
		maxLength: 5,
	},
};

export const WithPills = Template.bind({});
WithPills.args = {
	"textarea-with-pills": {
		fieldType: "textarea",
		label: "Textarea with pills",
		chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
	},
};

export const WithPillsBottom = Template.bind({});
WithPillsBottom.storyName = "With Pills (Bottom)";
WithPillsBottom.args = {
	"textarea-with-pills-bottom": {
		fieldType: "textarea",
		label: "Textarea with pills at the bottom",
		chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
		chipPosition: "bottom",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"textarea-with-validation": {
		fieldType: "textarea",
		label: "Textarea with validation",
		validation: [{ required: true }, { min: 3, errorMessage: "Min. 3 characters" }],
	},
};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
	"textarea-with-placeholder": {
		fieldType: "textarea",
		label: "Textarea with placeholder",
		placeholder: "Enter something...",
	},
};
