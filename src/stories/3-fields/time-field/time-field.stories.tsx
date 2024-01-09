import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ITimeFieldSchema } from "src/components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";

const meta: Meta = {
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
		...CommonFieldStoryProps("time-field"),
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
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
};
export default meta;

export const Default = DefaultStoryTemplate<ITimeFieldSchema>("time-default").bind({});
Default.args = {
	label: "Time",
	uiType: "time-field",
};

export const Disabled = DefaultStoryTemplate<ITimeFieldSchema>("time-disabled").bind({});
Disabled.args = {
	label: "Time",
	uiType: "time-field",
	disabled: true,
};

export const DefaultValue = DefaultStoryTemplate<ITimeFieldSchema>("time-default-value").bind({});
DefaultValue.args = {
	label: "Time",
	uiType: "time-field",
	defaultValues: "11:11am",
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

export const LabelCustomisation = DefaultStoryTemplate<ITimeFieldSchema>("time-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "time-field",
	label: {
		mainLabel: "Time <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
};

export const UseCurrentTime = DefaultStoryTemplate<ITimeFieldSchema>("time-use-current-time").bind({});
UseCurrentTime.args = {
	label: "Time",
	uiType: "time-field",
	useCurrentTime: true,
};

export const Placeholder = DefaultStoryTemplate<ITimeFieldSchema>("time-placeholder").bind({});
Placeholder.args = {
	label: "Time",
	uiType: "time-field",
	placeholder: "Select a preferred time",
};

export const Use24HoursFormat = DefaultStoryTemplate<ITimeFieldSchema>("time-24hr-format").bind({});
Use24HoursFormat.args = {
	label: "Time",
	uiType: "time-field",
	is24HourFormat: true,
};

export const Reset = ResetStoryTemplate<ITimeFieldSchema>("time-reset").bind({});
Reset.args = {
	label: "Time",
	uiType: "time-field",
};

export const ResetWithDefaultValues = ResetStoryTemplate<ITimeFieldSchema>("time-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	label: "Time",
	uiType: "time-field",
	defaultValues: "11:11am",
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

export const ResetToCurrentTime = ResetStoryTemplate<ITimeFieldSchema>("date-reset-current-date").bind({});
ResetToCurrentTime.args = {
	label: "Time",
	uiType: "time-field",
	useCurrentTime: true,
};

export const Overrides = OverrideStoryTemplate<ITimeFieldSchema>("time-overrides").bind({});
Overrides.args = {
	label: "Time",
	uiType: "time-field",
	overrides: {
		label: "Overridden",
		useCurrentTime: true,
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
