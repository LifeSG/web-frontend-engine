import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ITimeFieldSchema } from "src/components/fields";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

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
	)) as Story<ITimeFieldSchema & { defaultValues?: string | undefined }>;

export const Default = Template("time-default").bind({});
Default.args = {
	label: "Time",
	uiType: "time-field",
};

export const Disabled = Template("time-disabled").bind({});
Disabled.args = {
	label: "Time",
	uiType: "time-field",
	disabled: true,
};

export const DefaultValue = Template("time-default-value").bind({});
DefaultValue.args = {
	label: "Time",
	uiType: "time-field",
	defaultValues: "11:11am",
};

export const UseCurrentTime = Template("time-use-current-time").bind({});
UseCurrentTime.args = {
	label: "Time",
	uiType: "time-field",
	useCurrentTime: true,
};

export const Placeholder = Template("time-placeholder").bind({});
Placeholder.args = {
	label: "Time",
	uiType: "time-field",
	placeholder: "Select a preferred time",
};

export const Use24HoursFormat = Template("time-24hr-format").bind({});
Use24HoursFormat.args = {
	label: "Time",
	uiType: "time-field",
	is24HourFormat: true,
};
