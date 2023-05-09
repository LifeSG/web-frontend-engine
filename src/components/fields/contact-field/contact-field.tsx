import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { ERROR_MESSAGES } from "../../shared/error-messages";
import { getCountryFromPrefix, getInternationalCallingCodeMap } from "./data";
import { IContactFieldSchema, ISelectedCountry, TCallingCodeMap, TCountry, TSingaporeNumberRule } from "./types";
import { PhoneHelper } from "./utils";
import { PhoneNumberInputValue } from "@lifesg/react-design-system";

export const ContactField = (props: IGenericFieldProps<IContactFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, country, disabled, enableSearch, validation, placeholder, ...otherSchema },
		id,
		name,
		onChange,
		value,
		error,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string>(value || "");
	const [countryValue, setCountryValue] = useState<TCountry>(country);
	const [internationalCodeMap, setInternationalCodeMap] = useState<TCallingCodeMap>(new Map());
	const [selectedCountry, setSelectedCountry] = useState<ISelectedCountry>();
	const [singaporeRule, setSingaporeRule] = useState<TSingaporeNumberRule>();
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const countryMap = getInternationalCallingCodeMap();

		setInternationalCodeMap(countryMap);
	}, []);

	useEffect(() => {
		const contactNumberRule = validation?.find((rule) => "contactNumber" in rule);
		const singaporeRule = contactNumberRule?.["contactNumber"]?.["singaporeNumber"];
		const internationalNumberRule = contactNumberRule?.["contactNumber"]?.["internationalNumber"];
		const errorMessage = contactNumberRule?.["errorMessage"];

		const fixedCountryName = typeof internationalNumberRule === "boolean" ? undefined : internationalNumberRule;

		if (fixedCountryName) setCountryValue(fixedCountryName);

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
						if (!value || singaporeRule) return true;

						return PhoneHelper.isInternationalNumber(selectedCountry?.name, value);
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, selectedCountry]);

	useEffect(() => {
		if (internationalCodeMap.size === 0) return;

		const countryName = countryValue || "Singapore";

		setSelectedCountry({
			name: countryName,
			prefix: internationalCodeMap.get(countryName),
		});
	}, [countryValue, internationalCodeMap]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (value: PhoneNumberInputValue): void => {
		const { countryCode, number } = value;

		const countryCodeWithoutPlus = countryCode.replace(/\+/g, "");
		const phoneNumberWithPrefix = PhoneHelper.formatPhoneNumber(countryCode, number);

		// update country code
		if (countryCodeWithoutPlus !== selectedCountry.prefix) {
			const countryName = getCountryFromPrefix(countryCodeWithoutPlus, internationalCodeMap);

			setSelectedCountry({
				name: countryName,
				prefix: countryCode,
			});
		}

		setStateValue(number);
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

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<>
			<Form.PhoneNumberInput
				{...otherSchema}
				{...otherProps}
				data-testid={TestHelper.generateId(id, "contact")}
				disabled={disabled}
				enableSearch={enableSearch}
				errorMessage={error?.message}
				id={id}
				label={label}
				name={name}
				placeholder={getPlaceholderText()}
				value={formatDisplayValue()}
				onChange={handleChange}
			/>
		</>
	);
};
