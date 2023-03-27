import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ITimeFieldSchema } from "src/components/fields";
import { FrontendEngine } from "../../../components";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/TimeField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TimeField</Title>
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
		...CommonFieldStoryProps("time-field"),
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
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		useCurrentTime: {
			description: "Specifies if the form element should default to current time",
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
		is24HourFormat: {
			description: "Specifies if the form element should use 24 hours time format",
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

const Template: Story<Record<string, ITimeFieldSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	"time-default": {
		label: "Time",
		uiType: "time-field",
	},
};

export const Disabled = Template.bind({});
Disabled.args = {
	"time-disabled": {
		label: "Time",
		uiType: "time-field",
		disabled: true,
	},
};

export const DefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"time-default-value": {
					uiType: "time-field",
					label: "Time",
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
		label: "Time",
		uiType: "time-field",
		useCurrentTime: true,
	},
};

export const WithDefaultValue = () => (
	<FrontendEngine
		data={{
			fields: {
				"time-default": { uiType: "time-field", label: "Time" },
				...SubmitButtonStorybook,
			},
			defaultValues: { "time-default": "1:23pm" },
		}}
	/>
);
WithDefaultValue.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"time-placeholder": {
		label: "Time",
		uiType: "time-field",
		placeholder: "Select a preferred time",
	},
};

export const Use24HoursFormat = Template.bind({});
Use24HoursFormat.args = {
	"time-24hr-format": {
		label: "Time",
		uiType: "time-field",
		is24HourFormat: true,
	},
};
