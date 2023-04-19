import { Button } from "@lifesg/react-design-system/button";
import { useFormContext } from "react-hook-form";
import { IGenericFieldProps } from "../../frontend-engine";
import { IResetButtonSchema } from "./types";

export const ResetButton = (props: IGenericFieldProps<IResetButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, disabled, ...otherSchema },
		id,
		...otherProps
	} = props;

	const { reset } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================

	const onClick = () => {
		reset({}, { keepDefaultValues: true });
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
