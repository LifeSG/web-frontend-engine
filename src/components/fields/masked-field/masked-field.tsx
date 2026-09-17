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

	// recomputed every render (not memoized) so it always reflects the maskRegex/validation in effect
	// for *this* render, not a stale value from before an async effect has caught up
	const safeLength = getMaskRegexSafeLength();

	const clampValue = (val: string | undefined): string => {
		const stringVal = val ?? "";
		return safeLength !== undefined ? stringVal.slice(0, safeLength) : stringVal;
	};

	const [stateValue, setStateValue] = useState<string>(() => clampValue(value));
	const [derivedAttributes, setDerivedAttributes] = useState<FormInputProps>({});
	const { setFieldValidationConfig } = useValidationConfig();

	// clamped at render time, not just in the effect below — an effect only runs after a render has
	// already committed, so if maskRegex changes while stateValue is still a long, pre-existing value,
	// the unclamped stateValue would otherwise reach MaskedInput's own regex-driven masking on that
	// render, before the effect gets a chance to shorten it
	const displayedValue = clampValue(stateValue);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const maxRule = validation?.find((rule) => "max" in rule);
		const lengthRule = validation?.find((rule) => "length" in rule);

		let schema = Yup.string();
		if (maskRegex && !maxRule && !lengthRule) {
			// no author-specified max/length exists to validate against, so without this the implicit
			// safe-length bound used for clamping/masking is never actually enforced as a real
			// validation error - an oversized programmatic value would just be silently clamped for
			// display while the full value remains in form state and gets submitted as-is
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
				// MaskedInput keeps its own internal raw-value tracking rather than always deriving it from
				// the `value` prop on every render - when maskRegex newly appears while that internal state
				// still holds a long pre-existing value, it re-masks against ITS stale internal value, not
				// the (already-clamped) value passed this render, which reintroduces the catastrophic
				// pattern regardless of our own clamping. Keying on maskRegex forces a full remount instead
				// of an in-place update whenever it changes, so the fresh instance always initialises its
				// internal state from the current, already-clamped displayedValue.
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
