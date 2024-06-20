import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, Warning } from "../../shared";
import { IUnitNumberFieldSchema } from "./types";

export const UnitNumberField = (props: IGenericFieldProps<IUnitNumberFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		formattedLabel,
		error,
		id,
		onChange,
		schema: { label: _label, validation, ...otherSchema },
		value,
		warning,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string>(value || "");
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const unitNumberRule = validation?.find((rule) => "unitNumberFormat" in rule);
		setFieldValidationConfig(
			id,
			Yup.string().matches(/^([a-zA-Z0-9]{1,3}-[a-zA-Z0-9]{1,5})$/, {
				excludeEmptyString: true,
				message: unitNumberRule?.["errorMessage"] || ERROR_MESSAGES.UNIT_NUMBER.INVALID,
			}),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value || "");
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (value: string): void => {
		onChange({ target: { value } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<>
			<Form.UnitNumberInput
				{...otherSchema}
				{...otherProps}
				id={id}
				data-testid={TestHelper.generateId(id, "unit-number")}
				label={formattedLabel}
				value={stateValue}
				onChange={handleChange}
				errorMessage={error?.message}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
