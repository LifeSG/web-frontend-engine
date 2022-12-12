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
	"time-default": {
		label: "Timepicker",
		fieldType: "time",
	},
};

export const Disabled = Template.bind({});
Disabled.args = {
	"time-disabled": {
		label: "Timepicker",
		fieldType: "time",
		disabled: true,
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"time-default-value": {
					fieldType: "time",
					label: "Timepicker",
				},
				...SubmitButtonStorybook,
			},
			defaultValues: { "time-default-value": "11:11am" },
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const UseCurrentTime = Template.bind({});
UseCurrentTime.args = {
	"time-use-current-time": {
		label: "Timepicker",
		fieldType: "time",
		useCurrentTime: true,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"time-placeholder": {
		label: "Timepicker",
		fieldType: "time",
		placeholder: "Select a preferred time",
	},
};

export const Use24HoursFormat = Template.bind({});
Use24HoursFormat.args = {
	"time-24hr-format": {
		label: "Timepicker",
		fieldType: "time",
		is24HourFormat: true,
	},
};
