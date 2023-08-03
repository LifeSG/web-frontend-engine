import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useFormSchema, useFormValues } from "../../../utils/hooks";
import { TFrontendEngineFieldSchema } from "../../frontend-engine/types";

interface IProps {
	id: string;
	schema: TFrontendEngineFieldSchema;
	Field: React.ComponentType<any>;
}

export const FieldWrapper = ({ Field, id, schema }: IProps) => {
	const { control, watch, setValue } = useFormContext();

	const {
		formSchema: { defaultValues, restoreMode },
	} = useFormSchema();
	const { formValues, setField } = useFormValues();

	useEffect(() => {
		const value = getInitialValue();
		setField(id, value);
		setValue(id, value);
	}, []);

	useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			if (name) {
				if (name === id) {
					setField(id, value[name]);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [watch]);

	// =========================================================================
	// HELPERS
	// =========================================================================

	function getInitialValue() {
		switch (restoreMode) {
			case "default-value":
				return defaultValues?.[id];
			case "user-input":
			default:
				return formValues[id];
		}
	}

	// =========================================================================
	// RENDER
	// =========================================================================

	return (
		<Controller
			control={control}
			name={id}
			shouldUnregister={true}
			render={({ field, fieldState }) => {
				const fieldProps = {
					...field,
					id,
					value: formValues[id],
					ref: undefined, // not passing ref because not all components have fields to be manipulated
				};
				return <Field schema={schema} {...fieldProps} {...fieldState} />;
			}}
		/>
	);
};
