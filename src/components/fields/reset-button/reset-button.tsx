import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import { Button } from "@lifesg/react-design-system/button";
import { useFormContext } from "react-hook-form";
import { IGenericFieldProps } from "../../frontend-engine";
import { IResetButtonSchema } from "./types";

export const ResetButton = (props: IGenericFieldProps<IResetButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, disabled, ignoreDefaultValues, ...otherSchema },
		id,
		...otherProps
	} = props;

	const { reset, getValues } = useFormContext();

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
				}
			});
			reset(values);
		} else reset();
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
