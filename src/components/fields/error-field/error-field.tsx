import { useEffect } from "react";
import * as Yup from "yup";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../types";
import { IErrorFieldSchema } from "./types";

export const ErrorField = (props: IGenericFieldProps<IErrorFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { id } = props;
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.mixed().test(() => false),
			[]
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return null;
};
