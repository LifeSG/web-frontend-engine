import { Button } from "@lifesg/react-design-system";
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
			schema: { id, title, disabled, onClick },
			...otherProps
		} = props;
		const { setFieldValidationConfig } = useValidationSchema();

		useEffect(() => {
			setFieldValidationConfig(id, Yup.mixed());
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<Button.Default {...otherProps} ref={ref} id={id} disabled={disabled} onClick={onClick} type="submit">
				{title}
			</Button.Default>
		);
	}
);
