import { Button } from "@lifesg/react-design-system/button";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { useValidationConfig, useValidationSchema } from "../../../utils/hooks";
import { ISubmitButtonSchema } from "./types";

export const SubmitButton = (props: IGenericFieldProps<ISubmitButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, disabled, ...otherSchema },
		id,
		...otherProps
	} = props;
	const { setFieldValidationConfig } = useValidationConfig();
	const { hardValidationSchema } = useValidationSchema();
	const formValues = useWatch({ disabled: disabled !== "invalid-form" });
	const [isDisabled, setIsDisabled] = useState(disabled === true);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.mixed());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useDeepCompareEffect(() => {
		if (disabled === "invalid-form") {
			try {
				hardValidationSchema.validateSync(formValues);
				setIsDisabled(false);
			} catch (error) {
				setIsDisabled(true);
			}
		}
	}, [formValues, hardValidationSchema]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Button.Default {...otherSchema} {...otherProps} disabled={isDisabled} data-testid={id} id={id} type="submit">
			{label}
		</Button.Default>
	);
};
