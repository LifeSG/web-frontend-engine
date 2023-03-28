import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IDateFieldSchema } from "src/components/fields/date-field/types";
import { CommonFieldStoryProps, StyledForm, SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Field/DateField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>DateField</Title>
					<Description>
						This component provides the functionality for users to input a specific date according to the
						date format
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("date-field"),
		useCurrentDate: {
			description: "Indicates if field should be prefilled with current system date",
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
		dateFormat: {
			description: `Date input and output format pattern string using <a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html" target="_blank" rel="noopener noreferrer">Java SimpleDateFormat code</a><br>Note: This does not change the date format presented in the field.`,
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "uuuu-MM-dd" },
			},
			control: {
				type: "text",
			},
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

const Template: Story<Record<string, IDateFieldSchema>> = (args) => (
	<StyledForm
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						...args,
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"date-default": {
		uiType: "date-field",
		label: "Date",
	},
};

export const UseCurrentDate = Template.bind({});
UseCurrentDate.args = {
	"date-use-current-date": {
		uiType: "date-field",
		label: "Date",
		useCurrentDate: true,
	},
};

export const WithDefaultValue = () => (
	<StyledForm
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						"date-default": { uiType: "date-field", label: "Date with default value" },
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
			defaultValues: { "date-default": "2022-01-01" },
		}}
	/>
);
WithDefaultValue.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const DateFormat = Template.bind({});
DateFormat.args = {
	"date-format": {
		uiType: "date-field",
		label: "Date",
		dateFormat: "d MMMM uuuu",
	},
};

export const DateFormatDefaultValues = () => (
	<StyledForm
		data={{
			id: "frontendEngine",
			sections: {
				section: {
					uiType: "section",
					children: {
						"date-format-default": {
							uiType: "date-field",
							label: "Date",
							dateFormat: "d MMMM uuuu",
						},
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
			defaultValues: { "date-format-default": "1 January 2022" },
		}}
	/>
);
DateFormatDefaultValues.storyName = "Date Format with Default Value";
DateFormatDefaultValues.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"date-with-validation": {
		uiType: "date-field",
		label: "Date",
		validation: [{ required: true }],
	},
};

export const FutureDateOnly = Template.bind({});
FutureDateOnly.args = {
	"date-future": {
		uiType: "date-field",
		label: "Date",
		validation: [{ required: true }, { future: true, errorMessage: "Only future dates allowed" }],
	},
};

export const PastDateOnly = Template.bind({});
PastDateOnly.args = {
	"date-past": {
		uiType: "date-field",
		label: "Date",
		validation: [{ required: true }, { past: true, errorMessage: "Only past dates allowed" }],
	},
};

export const NotFutureDate = Template.bind({});
NotFutureDate.args = {
	"date-now-or-past": {
		uiType: "date-field",
		label: "Date",
		validation: [{ required: true }, { notFuture: true, errorMessage: "No future dates" }],
	},
};

export const NotPastDate = Template.bind({});
NotPastDate.args = {
	"date-now-or-future": {
		uiType: "date-field",
		label: "Date",
		validation: [{ required: true }, { notPast: true, errorMessage: "No past dates" }],
	},
};

export const MinDate = Template.bind({});
MinDate.args = {
	"min-date": {
		uiType: "date-field",
		label: "Date",
		validation: [{ required: true }, { minDate: "2023-01-01", errorMessage: "Min date 01/01/2023" }],
	},
};

export const MaxDate = Template.bind({});
MaxDate.args = {
	"max-date": {
		uiType: "date-field",
		label: "Date",
		validation: [{ required: true }, { maxDate: "2023-01-01", errorMessage: "Max date 01/01/2023" }],
	},
};
