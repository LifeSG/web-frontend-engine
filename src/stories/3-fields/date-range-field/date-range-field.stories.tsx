import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { InputRangeProp } from "@lifesg/react-design-system/input-range-select/types";
import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { TDateRangeFieldSchema } from "src/components/fields/date-range-field/types";
import { CommonFieldStoryProps, DefaultStoryTemplate, ResetStoryTemplate, WarningStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Field/DateRangeField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>DateRangeField</Title>
					<p>
						This component provides the functionality for users to input a specific date according to the
						date format.
					</p>
					<ArgTypes of={Default} />
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
				"Specifies if dates normally disabled by `future`, `past`, `minDate`, `maxDate` and `excludedDates` validation rules are still selectable",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
			},
			control: {
				type: "boolean",
			},
		},
		numberOfDays: {
			description: "Specifies the number of days to be selected when <code>fixed-range</code> is specified",
			defaultValue: { summary: 7 },
			control: {
				type: "number",
			},
		},
		variant: {
			description:
				"When the <code>week</code> is specified, the component is a week selection. WARNING: this disables `future`, `past`, `minDate`, `maxDate` and `excludedDates` validation rules.<br /><br />When the <code>fixed-range</code> is specified, the component selects 7 days from selected day by default",
			table: {
				type: {
					summary: "range | week | fixed-range",
				},
			},
			options: ["range", "week", "fixed-range"],
			control: {
				type: "select",
			},
			defaultValue: `range`,
		},
		hideInputKeyboard: {
			description: "Indicates if the component should hide input keyboard when user clicks on input field",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
			},
			control: {
				type: "boolean",
			},
		},
	},
};

export default meta;

const DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern("uuuu-MM-dd")
	.withResolverStyle(ResolverStyle.STRICT)
	.withLocale(Locale.ENGLISH);

export const Default = DefaultStoryTemplate<TDateRangeFieldSchema>("date-default").bind({});
Default.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ notPast: true, errorMessage: "No past dates" }],
};

export const WithoutButtons = DefaultStoryTemplate<TDateRangeFieldSchema>("date-without-buttons").bind({});
WithoutButtons.args = {
	uiType: "date-range-field",
	label: "Date",
	withButton: false,
};

export const DefaultValue = DefaultStoryTemplate<TDateRangeFieldSchema, InputRangeProp<string>>(
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

export const LabelCustomisation = DefaultStoryTemplate<TDateRangeFieldSchema>("date-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "date-range-field",
	label: {
		mainLabel: "Date <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
};

export const DateFormat = DefaultStoryTemplate<TDateRangeFieldSchema>("date-format").bind({});
DateFormat.args = {
	uiType: "date-range-field",
	label: "Date",
	dateFormat: "d MMMM uuuu",
};

export const DateFormatDefaultValues = DefaultStoryTemplate<TDateRangeFieldSchema, InputRangeProp<string>>(
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

export const WithValidation = DefaultStoryTemplate<TDateRangeFieldSchema>("date-with-validation").bind({});
WithValidation.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<TDateRangeFieldSchema>("date-with-warning").bind({});
Warning.args = {
	uiType: "date-range-field",
	label: "Date",
};

export const WithDisabledDates = DefaultStoryTemplate<TDateRangeFieldSchema>("date-disabled-dates").bind({});
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

export const AllowedDisabledSelection = DefaultStoryTemplate<TDateRangeFieldSchema>(
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

export const FutureDateOnly = DefaultStoryTemplate<TDateRangeFieldSchema>("date-future").bind({});
FutureDateOnly.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { future: true, errorMessage: "Only future dates allowed" }],
};

export const PastDateOnly = DefaultStoryTemplate<TDateRangeFieldSchema>("date-past").bind({});
PastDateOnly.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { past: true, errorMessage: "Only past dates allowed" }],
};

export const NotFutureDate = DefaultStoryTemplate<TDateRangeFieldSchema>("date-not-future").bind({});
NotFutureDate.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { notFuture: true, errorMessage: "No future dates allowed" }],
};

export const NotPastDate = DefaultStoryTemplate<TDateRangeFieldSchema>("date-not-past").bind({});
NotPastDate.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { notPast: true, errorMessage: "No past dates allowed" }],
};

export const MinDate = DefaultStoryTemplate<TDateRangeFieldSchema>("min-date").bind({});
MinDate.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { minDate: LocalDate.now().minusMonths(1).format(DEFAULT_DATE_FORMATTER) }],
};

export const MaxDate = DefaultStoryTemplate<TDateRangeFieldSchema>("max-date").bind({});
MaxDate.args = {
	uiType: "date-range-field",
	label: "Date",
	validation: [{ required: true }, { maxDate: LocalDate.now().plusMonths(1).format(DEFAULT_DATE_FORMATTER) }],
};

export const Reset = ResetStoryTemplate<TDateRangeFieldSchema>("date-reset").bind({});
Reset.args = {
	uiType: "date-range-field",
	label: "Date",
};

export const ResetWithDefaultValues = ResetStoryTemplate<TDateRangeFieldSchema, InputRangeProp<string>>(
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

export const WeekRange = DefaultStoryTemplate<TDateRangeFieldSchema>("week-range").bind({});
WeekRange.args = {
	uiType: "date-range-field",
	label: "Date",
	variant: "week",
	validation: [{ required: true }],
};

export const FixedRange = DefaultStoryTemplate<TDateRangeFieldSchema>("fixed-range").bind({});
FixedRange.args = {
	uiType: "date-range-field",
	label: "Date",
	variant: "fixed-range",
	validation: [{ required: true }, { numberOfDays: 7 }],
};

export const HideInputKeyboard = DefaultStoryTemplate<TDateRangeFieldSchema>("hide-input-keyboard").bind({});
HideInputKeyboard.args = {
	uiType: "date-range-field",
	label: "Date",
	hideInputKeyboard: true,
};
