import { Button } from "@lifesg/react-design-system/button";
import { useEffect } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ISubmitButtonSchema } from "./types";

export const SubmitButton = (props: IGenericFieldProps<ISubmitButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, ...otherSchema },
		id,
		...otherProps
	} = props;
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.mixed());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Button.Default {...otherSchema} {...otherProps} id={id} type="submit">
			{label}
		</Button.Default>
	);
};
