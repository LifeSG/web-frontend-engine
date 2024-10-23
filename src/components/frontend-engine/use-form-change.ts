import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TFormYupConfig } from "../../context-providers";
import { useFormValues, usePrevious, useValidationConfig, useValidationSchema } from "../../utils/hooks";
import { IFrontendEngineProps, TFrontendEngineValues } from "./types";

/**
 * Handles change in form values and validity. Updates consumer change handlers and error state.
 *
 * @param props
 * @param formMethods
 * @returns `checkIsFormValid`: helper to check current form validity
 */
export const useFormChange = (props: IFrontendEngineProps, formMethods: UseFormReturn) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { data, onChange, onValueChange } = props;
	const { stripUnknown } = data || {};
	const { hardValidationSchema } = useValidationSchema();
	const { formValidationConfig } = useValidationConfig();
	const { watch, getValues, formState, clearErrors } = formMethods;
	const { setFields, setField, getFormValues } = useFormValues(formMethods);
	const [oldFormValues, setOldFormValues] = useState<TFrontendEngineValues>({});
	const [hasSchemaChange, setHasSchemaChange] = useState(false);
	const previousFormValidationConfig = usePrevious(formValidationConfig);
	const previousHardValidationSchema = usePrevious(hardValidationSchema);
	const previousFormValues = useRef(undefined);
	const previousFormValidity = useRef(undefined);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const checkIsFormValid = useCallback(() => {
		try {
			hardValidationSchema.validateSync(getValues());
			return true;
		} catch (error) {
			return false;
		}
	}, [getValues, hardValidationSchema]);

	const handleValueChange = useRef(() => {
		// noop
	});
	handleValueChange.current = () => {
		const formValues = getFormValues(undefined, stripUnknown);
		const formValidity = checkIsFormValid();
		// attach / fire onValueChange event only when formValidationConfig has values
		// otherwise isValid will be returned incorrectly as true
		if (onValueChange && Object.keys(formValidationConfig || {}).length) {
			// memoise to prevent unnecessary calls
			if (previousFormValidity.current !== formValidity || !isEqual(previousFormValues.current, formValues)) {
				onValueChange(formValues, formValidity);
			}
		}
		previousFormValues.current = formValues;
		previousFormValidity.current = formValidity;
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name) {
				setField(name, value[name]);
			} else {
				setFields(value);
			}
		});
		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		// attach / fire onChange event only when formValidationConfig has values
		// otherwise isValid will be returned incorrectly as true
		if (onChange && Object.keys(formValidationConfig || {}).length) {
			const subscription = watch(() => {
				onChange(getFormValues(undefined, stripUnknown), checkIsFormValid());
			});
			onChange(getFormValues(undefined, stripUnknown), checkIsFormValid());

			return () => subscription.unsubscribe();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkIsFormValid, onChange, watch, formValidationConfig]);

	useEffect(() => {
		const subscription = watch(() => {
			handleValueChange.current();
		});

		return () => subscription.unsubscribe();
	}, [watch]);

	useEffect(() => {
		// when config changes due to overrides or conditional rendering, mark validity for re-evaluation
		if (previousFormValidationConfig) {
			const mapValidationRules = (config: TFormYupConfig) => {
				return Object.entries(config).map(([fieldId, { validationRules }]) => [fieldId, validationRules]);
			};
			const previousValidationRules = mapValidationRules(previousFormValidationConfig);
			const validationRules = mapValidationRules(formValidationConfig);
			if (!isEqual(previousValidationRules, validationRules)) {
				setHasSchemaChange(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formValidationConfig]);

	useEffect(() => {
		// re-evaluate form validity when schema changes
		if (hasSchemaChange && previousHardValidationSchema !== hardValidationSchema) {
			handleValueChange.current();
			setHasSchemaChange(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasSchemaChange, hardValidationSchema]);

	useEffect(() => {
		const errors = formState.errors;

		if (errors && !isEmpty(errors)) {
			const subscription = watch((value) => {
				const apiErrors = Object.fromEntries(
					Object.entries(formState.errors).filter(([_, value]) => value.type === "api")
				);
				const hasApiErrors = apiErrors && !isEmpty(apiErrors);

				if (hasApiErrors) {
					Object.keys(apiErrors).forEach((key) => {
						const oldValue = oldFormValues[key];
						const updatedValue = value[key];

						if (oldValue !== updatedValue) {
							clearErrors(key);
						}
					});
				}

				setOldFormValues(value);
			});

			return () => subscription.unsubscribe();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState, watch]);

	return { checkIsFormValid };
};
