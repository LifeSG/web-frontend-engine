import capitalize from "lodash/capitalize";
import { FileHelper } from "../../utils";

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
	UPLOAD: (unit = "file", unitPlural = `${unit}s`) => ({
		BULK_UPLOAD_EXCEEDS_MAX: (max: number, unit = "file(s)") =>
			`Upload failed. You can only upload maximum of ${max} ${unit}.`,
		BULK_UPLOAD_EXCEEDS_MAX_WITH_REMAINING: (remaining: number) =>
			`Upload failed. You can only upload ${remaining} more ${
				remaining === 1 ? unit : unitPlural
			}. To upload more ${unitPlural}, you may wish to delete your previously uploaded ${unitPlural}.`,
		EXCEEDS_MAX_FILE_SIZE: (maxSize: number) =>
			`Upload failed. ${capitalize(unit)} exceeds the maximum size of ${maxSize} KB.`,
		GENERIC: "Upload failed. Please try again.",
		INCORRECT_DOC_TYPE: (acceptedFileTypes: string[]) =>
			`Upload failed. Only ${FileHelper.extensionsToSentence(acceptedFileTypes)} files are accepted.`,
	}),
};
