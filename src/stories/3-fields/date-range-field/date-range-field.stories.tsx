import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { InputRangeProp } from "@lifesg/react-design-system/input-range-select/types";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { IDateRangeFieldSchema } from "src/components/fields/date-range-field/types";
import { CommonFieldStoryProps, DefaultStoryTemplate, ResetStoryTemplate } from "../../common";

export default {
	title: "Field/DateRangeField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>DateRangeField</Title>
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
		...CommonFieldStoryProps("date-range-field"),
		dateFormat: {
			description: `Date input and output format pattern string using <a href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html" target="_blank" rel="noopener noreferrer">Java SimpleDateFormat code</a><br>Note: This does not change the date format presented in the field.`,
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "uuuu-MM-dd" },
			},
		},
		allowDisabledSelection: {
			description:
				"Specifies if dates normally disabled by `future`, `past`, `notFuture`, `notPast`, `minDate`, `maxDate` and `excludedDates` validation rules are still selectable",
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
		variant: {
			description: `When the <code>week</code> is specified, the component
			is a week selection.`,
			table: {
				type: {
					summary: "range | week",
				},
			},
			options: ["range", "week"],
			control: {
				type: "select",
			},
			defaultValue: `range`,
		},
	},
} as Meta;

const DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern("uuuu-MM-dd")
	.withResolverStyle(ResolverStyle.STRICT)
	.withLocale(Locale.ENGLISH);

export const Default = DefaultStoryTemplate<IDateRangeFieldSchema>("date-default").bind({});
Default.args = {
	uiType: "date-range-field",
	label: "Date",
};

export const DefaultValue = DefaultStoryTemplate<IDateRangeFieldSchema, InputRangeProp<string>>(
	"date-default-value"
).bind({});
DefaultValue.args = {
	uiType: "date-range-field",
	label: "Date with default value",
	defaultValues: { from: "2022-01-01", to: "2022-06-01" },
	validation: [{ required: true }],
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

export const DateFormat = DefaultStoryTemplate<IDateRangeFieldSchema>("date-format").bind({});
DateFormat.args = {
	uiType: "date-range-field",
	label: "Date",
	dateFormat: "d MMMM uuuu",
};

export const DateFormatDefaultValues = DefaultStoryTemplate<IDateRangeFieldSchema, InputRangeProp<string>>(
	"date-format-default"
).bind({});
DateFormatDefaultValues.storyName = "Date Format with Default Value";
DateFormatDefaultValues.args = {
	uiType: "date-range-field",
	label: "Date",
	dateFormat: "d MMMM uuuu",
	defaultValues: { from: "1 January 2022", to: "1 July 2022" },
};
DateFormatDefaultValues.argTypes = DefaultValue.argTypes;

export const WithValidation = DefaultStoryTemplate<IDateRangeFieldSchema>("date-with-validation").bind({});
WithValidation.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }],
};

export const WithDisabledDates = DefaultStoryTemplate<IDateRangeFieldSchema>("date-disabled-dates").bind({});
WithDisabledDates.args = {
	uiType: "date-range-field",
	label: "Disabled yesterday and tomorrow's dates",
	validation: [
		{
			excludedDates: [
				LocalDate.now().minusDays(1).format(DEFAULT_DATE_FORMATTER),
				LocalDate.now().plusDays(1).format(DEFAULT_DATE_FORMATTER),
			],
		},
	],
};

export const AllowedDisabledSelection = DefaultStoryTemplate<IDateRangeFieldSchema>(
	"date-disabled-dates-selection"
).bind({});
AllowedDisabledSelection.args = {
	uiType: "date-range-field",
	label: "Disabled yesterday and tomorrow's dates with allowed selection",
	allowDisabledSelection: true,
	validation: [
		{
			excludedDates: [
				LocalDate.now().minusDays(1).format(DEFAULT_DATE_FORMATTER),
				LocalDate.now().plusDays(1).format(DEFAULT_DATE_FORMATTER),
			],
			errorMessage: "This date should not be selected",
		},
	],
};

export const FutureDateOnly = DefaultStoryTemplate<IDateRangeFieldSchema>("date-future").bind({});
FutureDateOnly.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { future: true, errorMessage: "Only future dates allowed" }],
};

export const PastDateOnly = DefaultStoryTemplate<IDateRangeFieldSchema>("date-past").bind({});
PastDateOnly.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { past: true, errorMessage: "Only past dates allowed" }],
};

export const MinDate = DefaultStoryTemplate<IDateRangeFieldSchema>("min-date").bind({});
MinDate.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { minDate: LocalDate.now().minusMonths(1).format(DEFAULT_DATE_FORMATTER) }],
};

export const MaxDate = DefaultStoryTemplate<IDateRangeFieldSchema>("max-date").bind({});
MaxDate.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { maxDate: LocalDate.now().plusMonths(1).format(DEFAULT_DATE_FORMATTER) }],
};

export const Reset = ResetStoryTemplate<IDateRangeFieldSchema>("date-reset").bind({});
Reset.args = {
	uiType: "date-range-field",
	label: "Date",
};

export const ResetWithDefaultValues = ResetStoryTemplate<IDateRangeFieldSchema, InputRangeProp<string>>(
	"date-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "date-range-field",
	label: "Date",
	defaultValues: { from: "2022-01-01", to: "2022-06-01" },
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

export const WeekRange = DefaultStoryTemplate<IDateRangeFieldSchema>("week-range").bind({});
WeekRange.args = {
	uiType: "date-range-field",
	label: "Date",
	variant: "week",
	validation: [{ required: true }],
};
