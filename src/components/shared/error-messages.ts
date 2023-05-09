export const ERROR_MESSAGES = {
	COMMON: {
		REQUIRED_OPTION: "An option is required",
	},
	CONTACT: {
		INVALID_SINGAPORE_NUMBER: "Invalid Singapore number",
		INVALID_INTERNATIONAL_NUMBER: "Invalid international number",
	},
	EMAIL: {
		INVALID: "Invalid email address",
	},
	DATE: {
		MUST_BE_FUTURE: "Date must be in the future.",
		MUST_BE_PAST: "Date must be in the past.",
		CANNOT_BE_FUTURE: "Date cannot be in the future.",
		CANNOT_BE_PAST: "Date cannot be in the past.",
		MIN_DATE: (date: string) => `Date cannot be earlier than ${date}`,
		MAX_DATE: (date: string) => `Date cannot be later than ${date}`,
		INVALID: "Invalid date",
	},
	UNIT_NUMBER: {
		INVALID: "Invalid unit number",
	},
	GENERIC: {
		INVALID: "Invalid input",
		UNSUPPORTED: "This component is not supported by the engine",
	},
};
