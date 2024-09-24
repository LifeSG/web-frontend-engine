import { useEffect } from "react";
import * as Yup from "yup";
import { useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { IGenericFieldProps } from "../types";
import { IErrorFieldSchema } from "./types";

export const ErrorField = (props: IGenericFieldProps<IErrorFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		schema: { children },
	} = props;
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
	if (children) {
		return <Wrapper>{children}</Wrapper>;
	}

	return null;
};
