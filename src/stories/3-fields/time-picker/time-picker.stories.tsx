import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ITimePickerSchema } from "src/components/fields";
import { FrontendEngine } from "../../../components";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/TimePicker",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TimePicker</Title>
					<Description>A form element allows user to pick time</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("time"),
		timepicker: { table: { disable: true } },
		label: {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		disabled: {
			description: "Specifies if the form element is interactable",
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
		useCurrentTime: {
			description: "Specifies if the form element should default to current time",
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
		is24HourFormat: {
			description: "Specifies if the form element should use 24 hours time format",
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
	},
} as Meta;

const Template: Story<Record<string, ITimePickerSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	timepicker: {
		label: "Textfield",
		fieldType: "time",
	},
};

export const Disabled = Template.bind({});
Disabled.args = {
	"timepicker-disabled": {
		label: "Textfield",
		fieldType: "time",
		disabled: true,
	},
};

// TODO: Fix incorrect behaviour of no default value
export const CurrentTime = Template.bind({});
CurrentTime.args = {
	"timepicker-current-time": {
		label: "Textfield",
		fieldType: "time",
		useCurrentTime: true,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"timepicker-placeholder": {
		label: "Textfield",
		fieldType: "time",
		placeholder: "Select a preferred time",
	},
};

export const Use24HoursFormat = Template.bind({});
Use24HoursFormat.args = {
	"timepicker-24hr-format": {
		label: "Textfield",
		fieldType: "time",
		is24HourFormat: true,
	},
};
