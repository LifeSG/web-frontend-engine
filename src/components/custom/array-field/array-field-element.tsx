import isEqual from "lodash/isEqual";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useFormState } from "react-hook-form";
import { useCustomComponents, useFormSchema, usePrevious } from "../../../utils/hooks";
import { FrontendEngine, TErrorPayload } from "../../frontend-engine";
import { IFrontendEngineRef, TFrontendEngineFieldSchema, TFrontendEngineValues } from "../../types";

interface ArrayFieldElementProps {
	onChange: (data: TFrontendEngineValues, isFormValid: boolean) => void;
	schema: Record<string, TFrontendEngineFieldSchema>;
	formValues?: TFrontendEngineValues;
	error?: TErrorPayload;
}

const Component = (
	{ onChange, formValues, schema, error }: ArrayFieldElementProps,
	ref: ForwardedRef<IFrontendEngineRef>
) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const formRef = useRef<IFrontendEngineRef>(null);
	const errorRef = useRef<TErrorPayload | undefined>(undefined);
	const { customComponents } = useCustomComponents();
	const [sectionValues, setSectionValues] = useState<TFrontendEngineValues>({});
	const [defaultValues, setDefaultValues] = useState<TFrontendEngineValues>();
	const { isSubmitting, isDirty } = useFormState();
	const {
		formSchema: { restoreMode, revalidationMode, validationMode, stripUnknown },
	} = useFormSchema();
	const prevIsDirty = usePrevious(isDirty);

	useImperativeHandle<IFrontendEngineRef, IFrontendEngineRef>(ref, () => formRef.current);
	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		if (!isDirty && prevIsDirty !== undefined && prevIsDirty !== isDirty) {
			formRef.current?.reset();
		}
	}, [isDirty]);

	useEffect(() => {
		if (!isDirty) {
			setDefaultValues(formValues);
			return;
		}

		if (isEqual(formValues, sectionValues)) {
			return;
		}

		if (formValues) {
			Object.entries(formValues).forEach(([key, value]) => {
				formRef.current?.setValue(key, value);
			});
		}
	}, [formValues]);

	useEffect(() => {
		if (isSubmitting) {
			const handleValidation = async () => {
				// Validate child field rules
				await formRef.current?.validate();

				// Re-apply uniqueness errors after validate() clears them
				if (errorRef.current) {
					formRef.current?.setErrors(errorRef.current);
				}
			};

			handleValidation();
		}
	}, [isSubmitting]);

	useEffect(() => {
		errorRef.current = error;
		if (error) {
			formRef.current?.setErrors(error);
		} else {
			formRef.current?.clearErrors();
		}
	}, [error]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const handleChange = (values: TFrontendEngineValues, valid = false) => {
		if (!isDirty && prevIsDirty !== undefined && prevIsDirty !== isDirty) {
			return;
		}
		setSectionValues(values);
		onChange(values, valid);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<FrontendEngine
			ref={formRef}
			data={{
				sections: { section: { uiType: "section", children: schema } },
				defaultValues,
				restoreMode,
				revalidationMode,
				validationMode: validationMode ?? "onSubmit", // use onSubmit to prevent blur from clearing injected errors from `unique` validation
				stripUnknown,
			}}
			onValueChange={handleChange}
			wrapInForm={false}
			components={customComponents}
		/>
	);
};

export const ArrayFieldElement = forwardRef(Component);
