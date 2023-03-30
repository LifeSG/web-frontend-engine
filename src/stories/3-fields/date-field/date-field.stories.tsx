import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IDateFieldSchema } from "src/components/fields/date-field/types";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

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
	},
} as Meta;

const Template = (id: string) =>
	(({ defaultValues, ...args }) => {
		return (
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
		);
	}) as Story<IDateFieldSchema & { defaultValues?: string | undefined }>;

export const Default = Template("date-default").bind({});
Default.args = {
	uiType: "date-field",
	label: "Date",
};

export const UseCurrentDate = Template("date-use-current-date").bind({});
UseCurrentDate.args = {
	uiType: "date-field",
	label: "Date",
	useCurrentDate: true,
};

export const DefaultValue = Template("date-default-value").bind({});
DefaultValue.args = {
	uiType: "date-field",
	label: "Date with default value",
	defaultValues: "2022-02-01",
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

export const DateFormat = Template("date-format").bind({});
DateFormat.args = {
	uiType: "date-field",
	label: "Date",
	dateFormat: "d MMMM uuuu",
};

export const DateFormatDefaultValues = Template("date-format-default").bind({});
DateFormatDefaultValues.storyName = "Date Format with Default Value";
DateFormatDefaultValues.args = {
	uiType: "date-field",
	label: "Date",
	dateFormat: "d MMMM uuuu",
	defaultValues: "1 January 2022",
};
DateFormatDefaultValues.argTypes = DefaultValue.argTypes;

export const WithValidation = Template("date-with-validation").bind({});
WithValidation.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }],
};

export const FutureDateOnly = Template("date-future").bind({});
FutureDateOnly.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { future: true, errorMessage: "Only future dates allowed" }],
};

export const PastDateOnly = Template("date-past").bind({});
PastDateOnly.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { past: true, errorMessage: "Only past dates allowed" }],
};

export const NotFutureDate = Template("date-now-or-past").bind({});
NotFutureDate.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { notFuture: true, errorMessage: "No future dates" }],
};

export const NotPastDate = Template("date-now-or-future").bind({});
NotPastDate.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { notPast: true, errorMessage: "No past dates" }],
};

export const MinDate = Template("min-date").bind({});
MinDate.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { minDate: "2023-01-01", errorMessage: "Min date 01/01/2023" }],
};

export const MaxDate = Template("max-date").bind({});
MaxDate.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { maxDate: "2023-01-01", errorMessage: "Max date 01/01/2023" }],
};
