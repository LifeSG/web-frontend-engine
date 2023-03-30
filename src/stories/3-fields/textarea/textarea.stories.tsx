import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ITextareaSchema } from "../../../components/fields";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Field/Textarea",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Textarea</Title>
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
				defaultValue: { summary: false },
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
				defaultValue: { summary: 1 },
			},
			type: { name: "number" },
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
	)) as Story<ITextareaSchema & { defaultValues?: string | undefined }>;

export const Default = Template("textarea-default").bind({});
Default.args = {
	uiType: "textarea",
	label: "Textarea",
};

export const DefaultValue = Template("textarea-default-value").bind({});
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
		control: {
			type: "text",
		},
	},
};

export const AllowResize = Template("textarea-allow-resize").bind({});
AllowResize.args = {
	uiType: "textarea",
	label: "Resizable textarea",
	resizable: true,
	rows: 3,
};

export const WithCounter = Template.bind({});
WithCounter("textarea-with-counter").args = {
	uiType: "textarea",
	label: "Textarea with counter",
	validation: [{ max: 5 }],
};

export const WithPills = Template("textarea-with-pills").bind({});
WithPills.args = {
	uiType: "textarea",
	label: "Textarea with pills",
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
};

export const WithPillsBottom = Template("textarea-with-pills-bottom").bind({});
WithPillsBottom.storyName = "With Pills (Bottom)";
WithPillsBottom.args = {
	uiType: "textarea",
	label: "Textarea with pills at the bottom",
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
	chipPosition: "bottom",
};

export const WithValidation = Template("textarea-with-validation").bind({});
WithValidation.args = {
	uiType: "textarea",
	label: "Textarea with validation",
	validation: [{ required: true }, { min: 3, errorMessage: "Min. 3 characters" }],
};

export const WithPlaceholder = Template("textarea-with-placeholder").bind({});
WithPlaceholder.args = {
	uiType: "textarea",
	label: "Textarea with placeholder",
	placeholder: "Enter something...",
};
