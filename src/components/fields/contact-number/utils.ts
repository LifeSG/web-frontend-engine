import { byCountry } from "country-code-lookup";
import { CountryCode, parsePhoneNumber } from "libphonenumber-js";
import { IParsedPhoneNumber } from "./types";

const SINGAPORE_MOBILE_NUMBER_REGEX = /^(?!\+?6599)(?!^\+65\d{6}$)^(?:\+?(?:65)?([9,8]{1}\d{7}))$/;

export namespace PhoneHelper {
	export const getParsedPhoneNumber = (value: string): IParsedPhoneNumber => {
		const parsedValues = value.split(" ");
		const hasPrefix = parsedValues.length > 1;

		return {
			prefix: hasPrefix ? parsedValues[0] : "",
			number: hasPrefix ? parsedValues[1] : value,
		};
	};

	export const isSingaporeNumber = (value: string, validateHomeNumber = false): boolean => {
		const { number } = getParsedPhoneNumber(value);

		if (!number) {
			return false;
		}

		const phoneNumber = parsePhoneNumber(value, "SG");
		const isNumberValid = phoneNumber.isValid();
		const isMobileNumber = SINGAPORE_MOBILE_NUMBER_REGEX.test(number);

		if (validateHomeNumber) {
			return isNumberValid && !isMobileNumber;
		}
		return isNumberValid && isMobileNumber;
	};

	export const isInternationalNumber = (country: string, value: string): boolean => {
		const { number } = getParsedPhoneNumber(value);

		if (!country || !value || !number) {
			return false;
		}

		const countryCode = byCountry(country).iso2 as CountryCode;
		const phoneNumber = parsePhoneNumber(value, countryCode);

		return phoneNumber.isValid();
	};

	export const formatPhoneNumber = (prefix: string, value: string): string => {
		if (!prefix) {
			return value;
		}
		return `${prefix} ${value}`;
	};
}
