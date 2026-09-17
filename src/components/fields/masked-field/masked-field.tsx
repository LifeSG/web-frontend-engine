import { Form } from "@lifesg/react-design-system/form";
import { FormInputProps } from "@lifesg/react-design-system/form";
import * as Icons from "@lifesg/react-icons";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { RegexHelper, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Warning } from "../../shared";
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

	// maxLength as a DOM attribute only constrains what a user can type through the browser's native
	// input handling — it does nothing to a value that arrives via defaultValues or a form reset, which
	// sets stateValue (and therefore what MaskedInput evaluates maskRegex against) directly. Compute the
	// same bound as a plain function (not state) so it's available synchronously wherever stateValue is
	// set, not just once the derivedAttributes effect has run.
	const getMaskRegexSafeLength = (): number | undefined => {
		if (!maskRegex) return undefined;
		const maxRule = validation?.find((rule) => "max" in rule);
		const lengthRule = validation?.find((rule) => "length" in rule);
		if (maxRule?.max > 0) return maxRule.max;
		if (lengthRule?.length > 0) return lengthRule.length;
		return RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH;
	};

	const clampValue = (val: string | undefined): string => {
		const safeLength = getMaskRegexSafeLength();
		return safeLength !== undefined ? (val || "").slice(0, safeLength) : val || "";
	};

	const [stateValue, setStateValue] = useState<string>(() => clampValue(value));
	const [derivedAttributes, setDerivedAttributes] = useState<FormInputProps>({});
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);

		const maxRule = validation?.find((rule) => "max" in rule);
		const lengthRule = validation?.find((rule) => "length" in rule);
		const attributes = { ...derivedAttributes };
		if (maxRule?.max > 0) {
			attributes.maxLength = maxRule.max;
		} else if (lengthRule?.length > 0) {
			attributes.maxLength = lengthRule.length;
		} else if (maskRegex) {
			// maskRegex is tested against live keystrokes inside MaskedInput itself, which this codebase
			// doesn't own, so a catastrophic-backtracking pattern can't be bounded there directly. Capping
			// input length here is the only mitigation available without an upstream design-system change.
			attributes.maxLength = RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH;
		}
		setDerivedAttributes(attributes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, maskRegex]);

	useEffect(() => {
		setStateValue(clampValue(value));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

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
		const regex = RegexHelper.parseMatchesPattern(maskRegex);
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
				id={id}
				data-testid={TestHelper.generateId(id, uiType)}
				label={formattedLabel}
				onBlur={onBlur}
				onChange={handleChange}
				value={stateValue}
				errorMessage={error?.message}
				maskRegex={getRegex()}
				iconMask={renderIcon(iconMask)}
				iconUnmask={renderIcon(iconUnmask)}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
