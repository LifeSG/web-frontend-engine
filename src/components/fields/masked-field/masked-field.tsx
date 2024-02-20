import { Form } from "@lifesg/react-design-system/form";
import { FormInputProps } from "@lifesg/react-design-system/form/types";
import * as Icons from "@lifesg/react-icons";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IMaskedFieldSchema } from "./types";

export const MaskedField = (props: IGenericFieldProps<IMaskedFieldSchema>) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		value,
		schema: { label: _label, uiType, validation, maskRegex, iconMask, iconUnmask, ...otherSchema },
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string | number>(value || "");
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
		}
		setDerivedAttributes(attributes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		if (value !== stateValue) {
			setStateValue(value || "");
		}
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
		try {
			const matches = maskRegex.match(/\/(.*)\/([a-z]+)?/);
			return new RegExp(matches[1], matches[2]);
		} catch (err) {
			console.warn(`invalid regex pattern: ${maskRegex}`);
		}
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
		<Form.MaskedInput
			{...otherSchema}
			{...otherProps}
			{...derivedAttributes}
			id={id}
			data-testid={TestHelper.generateId(id, uiType)}
			label={formattedLabel}
			onChange={handleChange}
			value={stateValue}
			errorMessage={error?.message}
			maskRegex={getRegex()}
			iconMask={renderIcon(iconMask)}
			iconUnmask={renderIcon(iconUnmask)}
		/>
	);
};
