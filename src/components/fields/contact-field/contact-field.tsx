import { PhoneNumberInputValue } from "@lifesg/react-design-system";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { usePrevious, useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES } from "../../shared/error-messages";
import { getCountryFromPrefix, getCountryMap, getPrefixFromCountry } from "./data";
import { IContactFieldSchema, ISelectedCountry, TCallingCodeMap, TCountry, TSingaporeNumberRule } from "./types";
import { PhoneHelper } from "./utils";

export const ContactField = (props: IGenericFieldProps<IContactFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		formattedLabel,
		error,
		id,
		name,
		onChange,
		schema: { defaultCountry, disabled, enableSearch, label: _label, placeholder, validation, ...otherSchema },
		value,
		...otherProps
	} = props;

	const { setValue } = useFormContext();
	const [stateValue, setStateValue] = useState<string>(value || "");
	const prevDefaultCountry = usePrevious(defaultCountry);
	const [countryValue, setCountryValue] = useState<TCountry>(defaultCountry);
	const [internationalCodeMap] = useState<TCallingCodeMap>(getCountryMap());
	const [selectedCountry, setSelectedCountry] = useState<ISelectedCountry>();
	const [singaporeRule, setSingaporeRule] = useState<TSingaporeNumberRule>();
	const [fixedCountry, setFixedCountry] = useState<boolean>(undefined);
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const contactNumberRule = validation?.find((rule) => "contactNumber" in rule);
		const singaporeRule = contactNumberRule?.["contactNumber"]?.["singaporeNumber"];
		const internationalNumberRule = contactNumberRule?.["contactNumber"]?.["internationalNumber"];
		const errorMessage = contactNumberRule?.["errorMessage"];

		if (internationalCodeMap.has(internationalNumberRule)) {
			setCountryValue(internationalNumberRule);
			setFixedCountry(true);
		} else if ((["default", "house", "mobile"] as TSingaporeNumberRule[]).includes(singaporeRule)) {
			setCountryValue("Singapore");
			setFixedCountry(true);
		} else {
			setFixedCountry(false);
		}

		setSingaporeRule(singaporeRule);
		setFieldValidationConfig(
			id,
			Yup.string()
				.test("singaporeNumber", errorMessage || ERROR_MESSAGES.CONTACT.INVALID_SINGAPORE_NUMBER, (value) => {
					if (!value || !singaporeRule) return true;

					switch (singaporeRule) {
						case "default":
							return PhoneHelper.isSingaporeNumber(value, true) || PhoneHelper.isSingaporeNumber(value);
						case "house":
							return PhoneHelper.isSingaporeNumber(value, true);
						case "mobile":
							return PhoneHelper.isSingaporeNumber(value);
						default:
							break;
					}
				})
				.test(
					"internationalNumber",
					errorMessage || ERROR_MESSAGES.CONTACT.INVALID_INTERNATIONAL_NUMBER,
					(value) => {
						if (!value || singaporeRule || !internationalNumberRule) return true;

						return PhoneHelper.isInternationalNumber(selectedCountry?.name, value);
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, selectedCountry]);

	useEffect(() => {
		const countryName = countryValue || "Singapore";

		setSelectedCountry({
			name: countryName,
			prefix: internationalCodeMap.get(countryName),
		});
	}, [countryValue, internationalCodeMap]);

	useEffect(() => {
		const contactNumberRule = validation?.find((rule) => "contactNumber" in rule);
		const singaporeRule = contactNumberRule?.["contactNumber"]?.["singaporeNumber"];
		const internationalNumberRule = contactNumberRule?.["contactNumber"]?.["internationalNumber"];

		if (
			!!defaultCountry &&
			prevDefaultCountry !== defaultCountry &&
			!internationalCodeMap.has(internationalNumberRule) &&
			!(["default", "house", "mobile"] as TSingaporeNumberRule[]).includes(singaporeRule)
		) {
			setCountryValue(defaultCountry);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, defaultCountry]);

	// handles changes in value through reset or defaultValues
	// adds prefix if it is not specified
	useEffect(() => {
		if (fixedCountry !== undefined) {
			const { prefix, number } = PhoneHelper.getParsedPhoneNumber(value || "");
			const prefixWithoutPlus = prefix.replace(/\+/g, "");
			const schemaPrefix = getPrefixFromCountry(countryValue || "Singapore");
			if (!fixedCountry || (fixedCountry && prefixWithoutPlus === schemaPrefix)) {
				const fieldPrefix = prefix || schemaPrefix;
				const phoneNumberWithPrefix = parseAndApplyNumber({ countryCode: fieldPrefix, number });
				setValue(id, phoneNumberWithPrefix);
			} else {
				const phoneNumberWithPrefix = parseAndApplyNumber({ countryCode: "", number: "" });
				setValue(id, phoneNumberWithPrefix);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, fixedCountry, countryValue]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (value: PhoneNumberInputValue): void => {
		const phoneNumberWithPrefix = parseAndApplyNumber(value);
		onChange({ target: { value: phoneNumberWithPrefix } });
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const formatDisplayValue = (): PhoneNumberInputValue => {
		if (!selectedCountry) return undefined;

		const { prefix } = selectedCountry;

		return { number: stateValue, countryCode: prefix };
	};

	const getPlaceholderText = (): string => {
		if (placeholder) {
			return placeholder;
		}

		if (singaporeRule) {
			const isMobileNumber = singaporeRule === "mobile";

			return `Enter ${isMobileNumber ? "mobile" : "home"} number`;
		}

		return "Enter contact number";
	};

	/**
	 * sets number to be used in PhoneNumberInput
	 * switches country if applicable
	 * return phone number with prefix
	 */
	const parseAndApplyNumber = (value: PhoneNumberInputValue) => {
		const { countryCode, number } = value;
		const countryCodeWithoutPlus = countryCode.replace(/\+/g, "");

		// update country code
		if (fixedCountry === false && countryCodeWithoutPlus !== selectedCountry?.prefix) {
			const countryName = getCountryFromPrefix(countryCodeWithoutPlus, internationalCodeMap);

			if (countryName) {
				setSelectedCountry({
					name: countryName,
					prefix: countryCode,
				});
			}
		}
		setStateValue(number);

		// react-hook-form reverts to the default value when value is undefined (user trying to clear field)
		// set to empty string to overcome this behaviour
		return PhoneHelper.formatPhoneNumber(value.countryCode, value.number) || "";
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Form.PhoneNumberInput
			{...otherSchema}
			{...otherProps}
			data-testid={TestHelper.generateId(id, "contact")}
			disabled={disabled}
			enableSearch={enableSearch}
			errorMessage={error?.message}
			fixedCountry={fixedCountry}
			id={id}
			label={formattedLabel}
			name={name}
			placeholder={getPlaceholderText()}
			value={formatDisplayValue()}
			onChange={handleChange}
		/>
	);
};
