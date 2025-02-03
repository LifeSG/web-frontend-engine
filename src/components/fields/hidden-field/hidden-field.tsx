import isNil from "lodash/isNil";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { useValidationConfig } from "../../../utils/hooks";
import { THiddenFieldSchema } from "./types";

export const HiddenField = (props: IGenericFieldProps<THiddenFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		name,
		onBlur,
		onChange,
		schema: { showIf: _showIf, uiType: _uiType, validation, valueType, value: schemaValue, ...otherSchema },
		value,
	} = props;
	const { setFieldValidationConfig } = useValidationConfig();
	const { setValue } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		let baseYupSchema: Yup.AnySchema;
		switch (valueType) {
			case "null":
				baseYupSchema = Yup.mixed();
				break;
			case "number":
				baseYupSchema = Yup.number();
				break;
			case "boolean":
				baseYupSchema = Yup.boolean();
				break;
			case "string":
			default:
				baseYupSchema = Yup.string();
		}
		setFieldValidationConfig(id, baseYupSchema, validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, valueType]);

	useEffect(() => {
		if (valueType === "null" && value !== null) {
			setValue(id, null);
		} else if (!isNil(schemaValue) && value !== schemaValue) {
			setValue(id, schemaValue);
		}
	}, [setValue, id, valueType, schemaValue, value]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<input
			onBlur={onBlur}
			onChange={onChange}
			{...otherSchema}
			type="hidden"
			id={id}
			data-testid={id}
			name={name}
			value={schemaValue ?? value ?? ""}
		/>
	);
};
