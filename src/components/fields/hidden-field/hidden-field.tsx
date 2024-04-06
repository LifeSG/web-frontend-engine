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
		schema: { showIf: _showIf, uiType: _uiType, validation, ...otherSchema },
	} = props;
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

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
