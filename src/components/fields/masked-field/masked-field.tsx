import { Form } from "@lifesg/react-design-system/form";
import { FormInputProps } from "@lifesg/react-design-system/form";
import * as Icons from "@lifesg/react-icons";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { RegexHelper, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, Warning } from "../../shared";
import { IMaskedFieldSchema } from "./types";

export const MaskedField = (props: IGenericFieldProps<IMaskedFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		onBlur,
		onChange,
		value,
		schema: { label: _label, uiType, validation, maskRegex, iconMask, iconUnmask, ...otherSchema },
		warning,
	} = props;

	const getMaskRegexSafeLength = (): number | undefined => {
		if (!maskRegex) return undefined;
		const maxRule = validation?.find((rule) => "max" in rule);
		const lengthRule = validation?.find((rule) => "length" in rule);
		if (maxRule?.max > 0) return maxRule.max;
		if (lengthRule?.length > 0) return lengthRule.length;
		return RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH;
	};

	const safeLength = getMaskRegexSafeLength();

	const clampValue = (val: string | undefined): string => {
		const stringVal = val ?? "";
		return safeLength !== undefined ? stringVal.slice(0, safeLength) : stringVal;
	};

	const [stateValue, setStateValue] = useState<string>(() => clampValue(value));
	const [derivedAttributes, setDerivedAttributes] = useState<FormInputProps>({});
	const { setFieldValidationConfig } = useValidationConfig();

	const displayedValue = clampValue(stateValue);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const maxRule = validation?.find((rule) => "max" in rule);
		const lengthRule = validation?.find((rule) => "length" in rule);

		let schema = Yup.string();
		if (maskRegex && !maxRule && !lengthRule) {
			schema = schema.max(
				RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH,
				ERROR_MESSAGES.MASKED_FIELD.VALUE_TOO_LONG(RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH)
			);
		}
		setFieldValidationConfig(id, schema, validation);

		const attributes = { ...derivedAttributes };
		if (maxRule?.max > 0) {
			attributes.maxLength = maxRule.max;
		} else if (lengthRule?.length > 0) {
			attributes.maxLength = lengthRule.length;
		} else if (maskRegex) {
			attributes.maxLength = RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH;
		}
		setDerivedAttributes(attributes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, maskRegex]);

	useEffect(() => {
		setStateValue(clampValue(value));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [safeLength, value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		onChange(event);
	};

	// =============================================================================
	// HELPERS
	// =============================================================================
	const getRegex = () => {
		if (!maskRegex) return;
		const regex = RegexHelper.compile(maskRegex);
		if (!regex) {
			console.warn(`invalid regex pattern: ${maskRegex}`);
		}
		return regex;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderIcon = (icon?: keyof typeof Icons | undefined) => {
		if (!icon) return;
		const Element = Icons[icon];

		return <Element data-testid={icon} />;
	};

	return (
		<>
			<Form.MaskedInput
				{...otherSchema}
				{...derivedAttributes}
				key={maskRegex ?? "no-mask-regex"}
				id={id}
				data-testid={TestHelper.generateId(id, uiType)}
				label={formattedLabel}
				onBlur={onBlur}
				onChange={handleChange}
				value={displayedValue}
				errorMessage={error?.message}
				maskRegex={getRegex()}
				iconMask={renderIcon(iconMask)}
				iconUnmask={renderIcon(iconUnmask)}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
