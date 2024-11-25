import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IDateFieldSchema } from "src/components/fields/date-field/types";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/DateField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>DateField</Title>
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
		...CommonFieldStoryProps("date-field"),
		useCurrentDate: {
			description: "Indicates if field should be prefilled with current system date",
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
				defaultValue: { summary: "false" },
			},
			control: {
				type: "boolean",
			},
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

export const Default = DefaultStoryTemplate<IDateFieldSchema>("date-default").bind({});
Default.args = {
	uiType: "date-field",
	label: "Date",
};

export const UseCurrentDate = DefaultStoryTemplate<IDateFieldSchema>("date-use-current-date").bind({});
UseCurrentDate.args = {
	uiType: "date-field",
	label: "Date",
	useCurrentDate: true,
};

export const WithoutButtons = DefaultStoryTemplate<IDateFieldSchema>("date-without-buttons").bind({});
WithoutButtons.args = {
	uiType: "date-field",
	label: "Date",
	withButton: false,
};

export const DefaultValue = DefaultStoryTemplate<IDateFieldSchema>("date-default-value").bind({});
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
	},
};

export const LabelCustomisation = DefaultStoryTemplate<IDateFieldSchema>("date-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "date-field",
	label: {
		mainLabel: "Date <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
};

export const DateFormat = DefaultStoryTemplate<IDateFieldSchema>("date-format").bind({});
DateFormat.args = {
	uiType: "date-field",
	label: "Date",
	dateFormat: "d MMMM uuuu",
};

export const DateFormatDefaultValues = DefaultStoryTemplate<IDateFieldSchema>("date-format-default").bind({});
DateFormatDefaultValues.storyName = "Date Format with Default Value";
DateFormatDefaultValues.args = {
	uiType: "date-field",
	label: "Date",
	dateFormat: "d MMMM uuuu",
	defaultValues: "1 January 2022",
};
DateFormatDefaultValues.argTypes = DefaultValue.argTypes;

export const WithValidation = DefaultStoryTemplate<IDateFieldSchema>("date-with-validation").bind({});
WithValidation.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<IDateFieldSchema>("date-with-warning").bind({});
Warning.args = {
	uiType: "date-field",
	label: "Date",
};

export const WithDisabledDates = DefaultStoryTemplate<IDateFieldSchema>("date-disabled-dates").bind({});
WithDisabledDates.args = {
	uiType: "date-field",
	label: "Disabled yesterday and tomorrow's dates",
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

export const AllowedDisabledSelection = DefaultStoryTemplate<IDateFieldSchema>("date-disabled-dates-selection").bind(
	{}
);
AllowedDisabledSelection.args = {
	uiType: "date-field",
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

export const FutureDateOnly = DefaultStoryTemplate<IDateFieldSchema>("date-future").bind({});
FutureDateOnly.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { future: true, errorMessage: "Only future dates allowed" }],
};

export const PastDateOnly = DefaultStoryTemplate<IDateFieldSchema>("date-past").bind({});
PastDateOnly.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { past: true, errorMessage: "Only past dates allowed" }],
};

export const NotFutureDate = DefaultStoryTemplate<IDateFieldSchema>("date-now-or-past").bind({});
NotFutureDate.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { notFuture: true, errorMessage: "No future dates" }],
};

export const NotPastDate = DefaultStoryTemplate<IDateFieldSchema>("date-now-or-future").bind({});
NotPastDate.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { notPast: true, errorMessage: "No past dates" }],
};

export const MinDate = DefaultStoryTemplate<IDateFieldSchema>("min-date").bind({});
MinDate.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { minDate: "2023-01-01", errorMessage: "Min date 01/01/2023" }],
};

export const MaxDate = DefaultStoryTemplate<IDateFieldSchema>("max-date").bind({});
MaxDate.args = {
	uiType: "date-field",
	label: "Date",
	validation: [{ required: true }, { maxDate: "2023-01-01", errorMessage: "Max date 01/01/2023" }],
};

export const Reset = ResetStoryTemplate<IDateFieldSchema>("date-reset").bind({});
Reset.args = {
	uiType: "date-field",
	label: "Date",
};

export const ResetWithDefaultValues = ResetStoryTemplate<IDateFieldSchema>("date-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	uiType: "date-field",
	label: "Date",
	defaultValues: "2022-02-01",
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

export const ResetToCurrentDate = ResetStoryTemplate<IDateFieldSchema>("date-reset-current-date").bind({});
ResetToCurrentDate.args = {
	uiType: "date-field",
	label: "Date",
	useCurrentDate: true,
};

export const Overrides = OverrideStoryTemplate<IDateFieldSchema>("date-overrides").bind({});
Overrides.args = {
	uiType: "date-field",
	label: "Date",
	overrides: {
		label: "Overridden",
		useCurrentDate: true,
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;

export const HideInputKeyboard = DefaultStoryTemplate<IDateFieldSchema>("hide-input-keyboard").bind({});
HideInputKeyboard.args = {
	uiType: "date-field",
	label: "Date",
	hideInputKeyboard: true,
};

export const WithinDays = DefaultStoryTemplate<IDateFieldSchema>("within-days").bind({});
WithinDays.args = {
	uiType: "date-field",
	label: "Within Days",
	validation: [
		{ required: true },
		{
			withinDays: {
				numberOfDays: 5,
			},
			errorMessage: "Within 5 days more",
		},
	],
};

export const WithinDaysWithFromDate = DefaultStoryTemplate<IDateFieldSchema>("within-days-with-specific-date").bind({});
WithinDaysWithFromDate.args = {
	uiType: "date-field",
	label: {
		mainLabel: "Within Days",
		subLabel: "Specific date is set 2024-11-09",
	},
	validation: [
		{ required: true },
		{
			withinDays: {
				numberOfDays: 10,
				fromDate: "2024-11-09",
			},
		},
	],
};

export const WithinDaysWithCustomDateFormat = DefaultStoryTemplate<IDateFieldSchema>(
	"within-days-with-custom-date-format"
).bind({});
WithinDaysWithCustomDateFormat.args = {
	uiType: "date-field",
	label: {
		mainLabel: "Within Days",
		subLabel: "Specific date is set 9/11/2024, date format is d/M/uuuu",
	},
	dateFormat: "uuuu-MM-dd",

	validation: [
		{ required: true },
		{
			withinDays: {
				numberOfDays: 10,
				fromDate: "9/11/2024",
				dateFormat: "d/M/uuuu",
			},
		},
	],
};
