import { yupResolver } from "@hookform/resolvers/yup";
import isEmpty from "lodash/isEmpty";
import { ReactElement, Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { ObjectHelper, TestHelper } from "../../utils";
import { useValidationSchema } from "../../utils/hooks";
import { Sections } from "../elements/sections";
import { IFrontendEngineProps, IFrontendEngineRef, TErrorPayload, TFrontendEngineValues, TNoInfer } from "./types";
import { IYupValidationRule, YupHelper, YupProvider } from "./yup";

const FrontendEngineInner = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		data: {
			className: dataClassName = null,
			defaultValues,
			sections,
			id,
			revalidationMode = "onChange",
			validationMode = "onSubmit",
		},
		className = null,
		onChange,
		onSubmit,
	} = props;

	const { warnings, performSoftValidation, softValidationSchema, hardValidationSchema } = useValidationSchema();

	const formMethods = useForm({
		mode: validationMode,
		reValidateMode: revalidationMode,
		defaultValues: defaultValues,
		resolver: async (data, context, options) => {
			performSoftValidation(softValidationSchema, data);

			return await yupResolver(hardValidationSchema)(data, context, options);
		},
	});

	const {
		reset,
		watch,
		handleSubmit: reactFormHookSubmit,
		getValues,
		setValue,
		setError,
		formState,
		clearErrors,
	} = formMethods;

	const [oldFormValues, setOldFormValues] = useState<TFrontendEngineValues>({});

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	useImperativeHandle<Partial<IFrontendEngineRef>, Partial<IFrontendEngineRef>>(ref, () => ({
		getValues,
		setValue,
		isValid: checkIsFormValid,
		submit: reactFormHookSubmit(handleSubmit),
		addCustomValidation: YupHelper.addCondition,
		setErrors,
	}));

	const checkIsFormValid = useCallback(() => {
		try {
			hardValidationSchema.validateSync(getValues());
			return true;
		} catch (error) {
			return false;
		}
	}, [getValues, hardValidationSchema]);

	const handleSubmit = (data: TFrontendEngineValues): void => {
		onSubmit?.(data);
	};

	// NOTE: Wrapper component contains nested fields
	const setErrors = (errors: TErrorPayload): void => {
		Object.entries(errors).forEach(([key, value]) => {
			const isValidFieldKey = !!ObjectHelper.getNestedValueByKey(sections, key);

			if (!isValidFieldKey) {
				return;
			}

			if (Array.isArray(value)) {
				setError(key, { type: "api", message: value[0] });
			} else if (typeof value === "object") {
				setErrors(value as TErrorPayload);
			} else {
				const errorObject = ObjectHelper.getNestedValueByKey(errors, key);
				const errorMessage = Object.values(errorObject)[0];
				const fieldKey = Object.keys(errorObject)[0];

				setError(fieldKey, { type: "api", message: errorMessage as string });
			}
		});
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		if (onChange) {
			const subscription = watch((value) => {
				onChange(value, checkIsFormValid());
			});

			return () => subscription.unsubscribe();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkIsFormValid, onChange, watch]);

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

	useDeepCompareEffectNoCheck(() => {
		reset(defaultValues);
	}, [defaultValues]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const formId = id ? `frontend-engine-${id}` : "frontend-engine";
	const formClassNames = [className, dataClassName].join(" ").trim();

	return (
		<FormProvider {...formMethods}>
			<form
				id={formId}
				data-testid={TestHelper.generateId(id, "frontend-engine")}
				className={formClassNames}
				noValidate
				onSubmit={reactFormHookSubmit(handleSubmit)}
				ref={ref}
			>
				<Sections warnings={warnings} schema={sections} />
			</form>
		</FormProvider>
	);
});

/**
 * The one and only component needed to create your form
 *
 * Minimally you will need to set the `data` props which is the JSON schema to define the form
 */
export const FrontendEngine = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => {
	return (
		<YupProvider>
			<FrontendEngineInner {...props} ref={ref} />
		</YupProvider>
	);
}) as <V = undefined>(
	props: IFrontendEngineProps<TNoInfer<V, IYupValidationRule>> & { ref?: Ref<IFrontendEngineRef> }
) => ReactElement;

/**
 * casting as a function with generics as a way to define generics with forwardRef
 * the generics are a way to set custom definition of Yup validation config
 * `NoInfer` typing is to ensure validation config is either the default `IYupValidationRule` or explicitly typed
 * this prevent inferring from the data props entered by devs
 * can refer to `Add Custom Validation` story for more info
 */
