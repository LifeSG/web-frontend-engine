import { useFormContext } from "react-hook-form";
import { useFieldEvent } from "./use-field-event";
import { useValidationConfig } from "./use-validation-config";

/**
 * returns various functions for custom component's use
 *
 * to be used within custom components
 */
export const useFrontendEngineComponent = () => {
	const { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener } = useFieldEvent();
	const formContext = useFormContext();
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationConfig();

	return {
		event: {
			addFieldEventListener,
			dispatchFieldEvent,
			removeFieldEventListener,
		},
		formContext,
		validation: {
			setValidation: setFieldValidationConfig,
			removeValidation: removeFieldValidationConfig,
		},
	};
};
