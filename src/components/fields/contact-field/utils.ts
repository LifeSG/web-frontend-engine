import { byCountry } from "country-code-lookup";
import { CountryCode, parsePhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js";
import { IParsedPhoneNumber } from "./types";

const SINGAPORE_PHONE_NUMBER_REGEX = /^(?!\+?6599)(?!^\+65\d{6}$)^(?:\+?(?:65)?([9,8,6,3]{1}\d{7}))$/;
const SINGAPORE_HOME_NUMBER_REGEX = /^(?!^\+65\d{6}$)^(?:\+?(?:65)?(6{1}\d{7}))$/;
const SINGAPORE_MOBILE_NUMBER_REGEX = /^(?!\+?6599)(?!^\+65\d{6}$)^(?:\+?(?:65)?([9,8]{1}\d{7}))$/;

export namespace PhoneHelper {
	export const getParsedPhoneNumber = (value: string): IParsedPhoneNumber => {
		const parsedValue = parsePhoneNumberFromString(value);
		if (parsedValue) {
			// Use countryCallingCode (string, without '+')
			return {
				prefix: parsedValue.countryCallingCode || "",
				number: parsedValue.nationalNumber || "",
			};
		}
		// fallback to split for manual input
		const parsedValues = value.split(" ");
		const hasPrefix = parsedValues.length > 1;
		return {
			prefix: hasPrefix ? parsedValues[0] : "",
			number: hasPrefix ? parsedValues[1] : value,
		};
	};

	export const isSingaporeNumber = (
		value: string,
		validateMode: "default" | "house" | "mobile" = "default"
	): boolean => {
		try {
			const { number } = getParsedPhoneNumber(value);
			const phoneNumber = parsePhoneNumber(value, "SG");
			const isNumberValid = phoneNumber.isValid();
			const isMobileNumber = SINGAPORE_MOBILE_NUMBER_REGEX.test(number);
			const isHomeNumber = SINGAPORE_HOME_NUMBER_REGEX.test(number);
			const isPhoneNumber = SINGAPORE_PHONE_NUMBER_REGEX.test(number);

			switch (validateMode) {
				case "house":
					return isNumberValid && isHomeNumber;
				case "mobile":
					return isNumberValid && isMobileNumber;
				default:
					return isNumberValid && isPhoneNumber;
			}
		} catch (error) {
			return false;
		}
	};

	export const isInternationalNumber = (country: string, value: string): boolean => {
		try {
			if (!country || !value) {
				return false;
			}

			const countryCode = byCountry(country).iso2 as CountryCode;
			const phoneNumber = parsePhoneNumber(value, countryCode);

			return phoneNumber.isValid();
		} catch (error) {
			return false;
		}
	};

	export const formatPhoneNumber = (prefix: string, value: string): string | undefined => {
		if (!value) {
			return undefined;
		}

		if (!prefix) {
			return value;
		}

		if (prefix.indexOf("+") !== 0) {
			return `+${prefix} ${value}`;
		}

		return `${prefix} ${value}`;
	};
}
