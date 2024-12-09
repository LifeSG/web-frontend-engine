import { Button } from "@lifesg/react-design-system/button";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { useFrontendEngineForm, useValidationConfig, useValidationSchema } from "../../../utils/hooks";
import { ISubmitButtonSchema } from "./types";

export const SubmitButton = (props: IGenericFieldProps<ISubmitButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { disabled, label, ...otherSchema },
		...otherProps
	} = props;
	const { submitHandler, wrapInForm } = useFrontendEngineForm();
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
		(async () => {
			if (disabled === "invalid-form") {
				try {
					await hardValidationSchema.validate(formValues);
					setIsDisabled(false);
				} catch (error) {
					setIsDisabled(true);
				}
			}
		})();
	}, [formValues, hardValidationSchema]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		// perform manual submission only if FEE does not render the <form>
		if (!wrapInForm) {
			e.preventDefault();
			submitHandler?.();
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Button.Default
			{...otherSchema}
			{...otherProps}
			disabled={isDisabled}
			data-testid={id}
			id={id}
			onClick={handleClick}
			type="submit"
		>
			{label}
		</Button.Default>
	);
};
