import { Button } from "@lifesg/react-design-system/button";
import { useFormContext } from "react-hook-form";
import { IGenericFieldProps } from "../../frontend-engine";
import { IResetButtonSchema } from "./types";

export const ResetButton = (props: IGenericFieldProps<IResetButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, disabled, keepDefaultValues, ...otherSchema },
		id,
		...otherProps
	} = props;

	const { reset, getValues } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================

	const onClick = () => {
		if (keepDefaultValues) {
			reset();
		} else {
			const map: { [key: string]: string } = {};
			Object.keys(getValues()).forEach((key) => (map[key] = ""));
			reset(map);
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
