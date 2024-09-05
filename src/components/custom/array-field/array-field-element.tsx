import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-hook-form";
import { usePrevious } from "../../../utils/hooks";
import { FrontendEngine } from "../../frontend-engine";
import { IFrontendEngineRef, TFrontendEngineFieldSchema, TFrontendEngineValues } from "../../types";

interface ArrayFieldElementProps {
	onChange: (data: TFrontendEngineValues, isFormValid: boolean) => void;
	schema: Record<string, TFrontendEngineFieldSchema>;
	formValues?: TFrontendEngineValues;
}

export const ArrayFieldElement = ({ onChange, formValues, schema }: ArrayFieldElementProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const formRef = useRef<IFrontendEngineRef>(null);
	const [sectionValues, setSectionValues] = useState<TFrontendEngineValues>({});
	const [isSectionValid, setIsSectionValid] = useState<boolean>(false);
	const prevSectionValues = usePrevious(sectionValues);
	const prevSectionValid = usePrevious(isSectionValid);
	const { isSubmitting } = useFormState();

	// =============================================================================
	// EFFECTS
	// =============================================================================

	useEffect(() => {
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
		if (!isEmpty(sectionValues)) {
			if (!isEqual(prevSectionValues, sectionValues) || !isEqual(prevSectionValid, isSectionValid)) {
				onChange(sectionValues, isSectionValid);
			}
		}
	}, [sectionValues, isSectionValid]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const handleChange = (values: TFrontendEngineValues, valid = false) => {
		setIsSectionValid(valid);
		setSectionValues(values);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<FrontendEngine
			ref={formRef}
			data={{ sections: { section: { uiType: "section", children: schema } } }}
			onValueChange={handleChange}
			wrapInForm={false}
		/>
	);
};
