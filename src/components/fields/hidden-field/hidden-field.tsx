import { useEffect } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { useValidationConfig } from "../../../utils/hooks";
import { IHiddenFieldSchema } from "./types";

export const HiddenField = (props: IGenericFieldProps<IHiddenFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		name,
		onBlur,
		onChange,
		schema: { showIf: _showIf, uiType: _uiType, validation, valueType, ...otherSchema },
		value,
	} = props;
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		let baseYupSchema: Yup.AnySchema;
		switch (valueType) {
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
			value={value}
		/>
	);
};
