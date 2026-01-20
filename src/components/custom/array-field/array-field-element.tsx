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
			formRef.current?.validate();
		}
	}, [isSubmitting]);

	useEffect(() => {
		error && formRef.current?.setErrors(error);
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
				validationMode,
				stripUnknown,
			}}
			onValueChange={handleChange}
			wrapInForm={false}
			components={customComponents}
		/>
	);
};

export const ArrayFieldElement = forwardRef(Component);
