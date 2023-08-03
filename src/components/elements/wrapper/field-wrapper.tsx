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
	const { control, setValue } = useFormContext();

	const {
		formSchema: { defaultValues, restoreMode },
	} = useFormSchema();
	const { formValues, setField, isFieldShown, setFieldShown } = useFormValues();

	useEffect(() => {
		if (isFieldShown(id)) {
			// for conditionally rendered fields, we have to put the field back into the react-hook-form state
			setValue(id, formValues[id]);
		} else {
			setFieldShown(id);
		}

		return () => {
			if (restoreMode === "default-value") {
				setField(id, defaultValues?.[id]);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
