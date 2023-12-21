import capitalize from "lodash/capitalize";
import { ReactNode } from "react";
import { FileHelper } from "../../utils/file-helper"; // import directly to avoid circular dependency

export const ERROR_MESSAGES = {
	COMMON: {
		FIELD_REQUIRED: "This field is required",
		REQUIRED_OPTION: "An option is required",
		REQUIRED_OPTIONS: "Both options are required",
	},
	CONTACT: {
		INVALID_SINGAPORE_NUMBER: "Invalid Singapore number",
		INVALID_INTERNATIONAL_NUMBER: "Invalid international number",
	},
	DATE: {
		MUST_BE_FUTURE: "Date must be in the future.",
		MUST_BE_PAST: "Date must be in the past.",
		CANNOT_BE_FUTURE: "Date cannot be in the future.",
		CANNOT_BE_PAST: "Date cannot be in the past.",
		MIN_DATE: (date: string) => `Date cannot be earlier than ${date}`,
		MAX_DATE: (date: string) => `Date cannot be later than ${date}`,
		DISABLED_DATES: "Date is not allowed.",
		INVALID: "Invalid date",
	},
	DATE_RANGE: {
		MUST_BE_FUTURE: "Dates must be in the future.",
		MUST_BE_PAST: "Dates must be in the past.",
		CANNOT_BE_FUTURE: "Dates cannot be in the future.",
		CANNOT_BE_PAST: "Dates cannot be in the past.",
		MIN_DATE: (date: string) => `Dates cannot be earlier than ${date}`,
		MAX_DATE: (date: string) => `Dates cannot be later than ${date}`,
		DISABLED_DATES: "Date range should not include disabled dates.",
		INVALID: "Invalid dates",
		REQUIRED: "Both dates are required",
		MUST_BE_WITHIN_NUMBER_OF_DAYS: (numberOfDays: number) => `Selection should have ${numberOfDays} days`,
	},
	EMAIL: {
		INVALID: "Invalid email address",
	},
	GENERIC: {
		INVALID: "Invalid input",
		UNSUPPORTED: "This component is not supported by the engine",
	},
	UPLOAD: (unit = "file", unitPlural = `${unit}s`) => ({
		REQUIRED: `Upload at least 1 ${unit}`,
		MAX_FILES: (max: number) =>
			`Upload failed. You can only upload maximum of ${max} ${max !== 1 ? unitPlural : unit}.`,
		MAX_FILES_WITH_REMAINING: (remaining: number) =>
			`Upload failed. You can only upload ${remaining} more ${
				remaining === 1 ? unit : unitPlural
			}. To upload more ${unitPlural}, you may wish to delete your previously uploaded ${unitPlural}.`,
		MAX_FILE_SIZE: (maxSize: number) =>
			`Upload failed. ${capitalize(unit)} exceeds the maximum size of ${maxSize} KB.`,
		GENERIC: "Upload failed. Please try again.",
		FILE_TYPE: (acceptedFileTypes: string[]) =>
			`Upload failed. Only ${FileHelper.extensionsToSentence(acceptedFileTypes)} files are accepted.`,
		MODAL: {
			FILE_TYPE: {
				TITLE: `Unsupported ${unit} format`,
				DESCRIPTION: (filename: ReactNode, acceptedFileTypes: string[]) => (
					<>
						{filename} could not be uploaded. Try again with a{" "}
						{FileHelper.extensionsToSentence(acceptedFileTypes)} file.
					</>
				),
			},
			GENERIC_ERROR: {
				TITLE: `${capitalize(unit)} not uploaded`,
				DESCRIPTION: (filename: ReactNode) => <>There was a problem uploading {filename}. Please try again.</>,
			},
			MAX_FILE_SIZE: {
				TITLE: `${capitalize(unit)} exceeds maximum size`,
				DESCRIPTION: (filename: ReactNode, maxSize: number) => (
					<>
						{filename} exceeds the maximum size of {maxSize} KB.
					</>
				),
			},
		},
	}),
	UNIT_NUMBER: {
		INVALID: "Invalid unit number",
	},
	LOCATION: {
		MUST_HAVE_POSTAL_CODE: "Selected location must have postal code",
		INVALID_LOCATION: "Invalid location",
	},
};
