import { Form } from "@lifesg/react-design-system/form";
import { AddonProps } from "@lifesg/react-design-system/input-group/types";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { ERROR_MESSAGES } from "../../shared/error-messages";
import { getCountries, getCountryFromPrefix, getPrefix, InternationalCallingCodeMap } from "./data";
import { IContactNumberSchema, ISelectedCountry, TCountry, TSingaporeNumberRule } from "./types";
import { PhoneHelper } from "./utils";

export const ContactNumber = (props: IGenericFieldProps<IContactNumberSchema>) => {
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
	const [selectedCountry, setSelectedCountry] = useState<ISelectedCountry>();
	const [singaporeRule, setSingaporeRule] = useState<TSingaporeNumberRule>();
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const contactNumberRule = validation?.find((rule) => "contactNumber" in rule);
		const singaporeRule = contactNumberRule?.contactNumber?.singaporeNumber;
		const internationalRule = contactNumberRule?.contactNumber?.internationalNumber;
		const errorMessage = contactNumberRule?.errorMessage;

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
						if (!value || !internationalRule) return true;

						return PhoneHelper.isInternationalNumber(selectedCountry?.name, value);
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, selectedCountry]);

	useEffect(() => {
		setStateValue(value || "");
	}, [value]);

	useEffect(() => {
		const countryName = country || "Singapore";

		setSelectedCountry({
			name: countryName,
			prefix: getPrefix(countryName),
		});
	}, [country]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handlePrefixChange = (key: TCountry, prefix: string): void => {
		const { number: phoneNumberWithoutPrefix } = PhoneHelper.getParsedPhoneNumber(stateValue);
		const phoneNumberWithPrefix = PhoneHelper.formatPhoneNumber(prefix, phoneNumberWithoutPrefix);

		setSelectedCountry({ name: key, prefix });
		onChange({ target: { value: phoneNumberWithPrefix } });
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const phoneNumberWithPrefix = PhoneHelper.formatPhoneNumber(selectedCountry?.prefix, event.target.value);

		onChange({ target: { value: phoneNumberWithPrefix } });
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const formatDisplayValue = (): string => {
		const parsedValues = stateValue.split(" ");
		return parsedValues.length > 1 ? parsedValues[1] : stateValue;
	};

	const getSpacing = (): number => {
		if (selectedCountry?.name === "Singapore") return 4;

		return 0;
	};

	const getMaxLength = (): number => {
		if (selectedCountry?.name === "Singapore") {
			return 9;
		}
		return 14;
	};

	const getAddOns = (): AddonProps<string, unknown> => {
		if (singaporeRule) {
			return { attributes: { value: "+65" } };
		}

		return {
			type: "list",
			attributes: {
				options: getCountries(),
				listExtractor: (item: string) => `${item} (${getPrefix(item)})`,
				enableSearch,
				onSelectOption: handlePrefixChange,
				value: selectedCountry
					? getCountryFromPrefix(selectedCountry.prefix)
					: InternationalCallingCodeMap["Singapore"],
				valueExtractor: (item: string) => getPrefix(item),
			},
		};
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
		<Form.InputGroup
			{...otherSchema}
			{...otherProps}
			id={id}
			name={name}
			disabled={disabled}
			type="tel"
			inputMode="tel"
			label={label}
			value={formatDisplayValue()}
			onChange={handleChange}
			addon={getAddOns()}
			errorMessage={error?.message}
			placeholder={getPlaceholderText()}
			spacing={getSpacing()}
			maxLength={getMaxLength()}
		/>
	);
};
