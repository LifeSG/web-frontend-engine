import { Button } from "@lifesg/react-design-system/button";
import isArray from "lodash/isArray";
import isNumber from "lodash/isNumber";
import isObjectLike from "lodash/isObjectLike";
import isString from "lodash/isString";
import { useFormContext } from "react-hook-form";
import { IGenericFieldProps } from "..";
import { useFormSchema, useFormValues } from "../../../utils/hooks";
import { IResetButtonSchema } from "./types";

export const ResetButton = (props: IGenericFieldProps<IResetButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { disabled, ignoreDefaultValues, label, ...otherSchema },
		...otherProps
	} = props;

	const { reset, getValues } = useFormContext();
	const { resetFields } = useFormValues();
	const {
		formSchema: { defaultValues },
	} = useFormSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	const onClick = () => {
		if (ignoreDefaultValues) {
			const values = getValues();
			Object.entries(values).forEach(([key, value]) => {
				if (isArray(value)) {
					values[key] = [];
				} else if (isString(value) || isNumber(value)) {
					values[key] = "";
				} else if (isObjectLike(value)) {
					values[key] = {};
				}
			});
			reset(values);
			resetFields(values);
		} else {
			reset();
			resetFields(defaultValues);
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Button.Default
			{...otherSchema}
			{...otherProps}
			disabled={disabled}
			data-testid={id}
			id={id}
			type="reset"
			onClick={onClick}
		>
			{label}
		</Button.Default>
	);
};
