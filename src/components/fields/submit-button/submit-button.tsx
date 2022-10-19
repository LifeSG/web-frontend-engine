import { Button } from "@lifesg/react-design-system/button";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ISubmitButtonSchema } from "./types";

export const SubmitButton = React.forwardRef<HTMLButtonElement, IGenericFieldProps<ISubmitButtonSchema>>(
	(props, ref) => {
		// =============================================================================
		// CONST, STATE, REF
		// =============================================================================
		const {
			schema: { id, title, ...otherSchema },
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
			<Button.Default {...otherSchema} {...otherProps} ref={ref} id={id} type="submit">
				{title}
			</Button.Default>
		);
	}
);
