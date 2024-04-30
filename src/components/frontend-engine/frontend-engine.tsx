import { yupResolver } from "@hookform/resolvers/yup";
import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import { ReactElement, Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useDeepCompareEffect, { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import {
	ContextProviders,
	IYupValidationRule,
	TCustomValidationFunction,
	TYupSchemaType,
	YupHelper,
} from "../../context-providers";
import { ObjectHelper, TestHelper } from "../../utils";
import {
	useCustomComponents,
	useFieldEvent,
	useFormSchema,
	useFormValues,
	useFrontendEngineForm,
	useValidationConfig,
	useValidationSchema,
} from "../../utils/hooks";
import { Sections } from "../elements/sections";
import {
	IFrontendEngineProps,
	IFrontendEngineRef,
	TErrorPayload,
	TFrontendEngineValues,
	TNoInfer,
	TWarningPayload,
} from "./types";

const FrontendEngineInner = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		data,
		className = null,
		components,
		onChange,
		onSubmit,
		onSubmitError,
		onValueChange,
		wrapInForm = true,
	} = props;
	const {
		className: dataClassName = null,
		defaultValues,
		sections,
		id,
		stripUnknown,
		revalidationMode = "onChange",
		validationMode = "onTouched",
	} = data || {};

	const { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener } = useFieldEvent();
	const { setCustomComponents } = useCustomComponents();
	const { setSubmitHandler, setWrapInForm } = useFrontendEngineForm();
	const {
		addWarnings,
		performSoftValidation,
		softValidationSchema,
		hardValidationSchema,
		rebuildValidationSchema,
		yupId,
	} = useValidationSchema();
	const { formValidationConfig } = useValidationConfig();
	const formMethods = useForm({
		mode: validationMode,
		reValidateMode: revalidationMode,
		defaultValues,
		resolver: async (data, context, options) => {
			performSoftValidation(softValidationSchema, data);

			return await yupResolver(hardValidationSchema)(data, context, options);
		},
	});
	const { setFormSchema } = useFormSchema();
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
	const { resetFields, setFields, setField, getFormValues } = useFormValues(formMethods);

	const [oldFormValues, setOldFormValues] = useState<TFrontendEngineValues>({});

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	useImperativeHandle<Partial<IFrontendEngineRef>, Partial<IFrontendEngineRef>>(ref, () => ({
		addFieldEventListener,
		addCustomValidation,
		dispatchFieldEvent,
		getValues: (payload?: string | string[] | undefined) => getFormValues(payload, stripUnknown),
		isDirty: formState.isDirty,
		isValid: checkIsFormValid,
		removeFieldEventListener,
		reset: (values, options) => {
			reset(values, options);

			if (typeof values === "function") {
				resetFields(values(formMethods.getValues()) ?? defaultValues);
			} else {
				resetFields(values ?? defaultValues);
			}
		},
		setErrors,
		setWarnings,
		setValue,
		submit: reactFormHookSubmit(handleSubmit, handleSubmitError),
	}));

	const addCustomValidation = (
		type: TYupSchemaType | "mixed",
		name: string,
		fn: TCustomValidationFunction,
		overwrite = false
	) => {
		YupHelper.addCondition(type, name, fn, yupId, overwrite);
		rebuildValidationSchema();
	};

	const checkIsFormValid = useCallback(() => {
		try {
			hardValidationSchema.validateSync(getValues());
			return true;
		} catch (error) {
			return false;
		}
	}, [getValues, hardValidationSchema]);

	const handleSubmit = useCallback((): void => {
		onSubmit?.(getFormValues(undefined, stripUnknown));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getFormValues, onSubmit, stripUnknown]);

	const handleSubmitError = useCallback(
		(errors: TFrontendEngineValues): void => {
			// NOTE: this delays the callback into the process tick, ensuring the dom has updated by then
			// this allows for potential error handling targeting attribute tags like `aria-invalid`
			setTimeout(() => onSubmitError?.(errors));
		},
		[onSubmitError]
	);

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
				if (!isEmpty(errorObject)) {
					const errorMessage = Object.values(errorObject)[0];
					const fieldKey = Object.keys(errorObject)[0];

					setError(fieldKey, { type: "api", message: errorMessage as string });
				}
			}
		});
	};

	const setWarnings = (warningPayload: TWarningPayload) => {
		const newWarnings: TWarningPayload = {};
		Object.entries(warningPayload).forEach(([key, value]) => {
			const isValidFieldKey = !!ObjectHelper.getNestedValueByKey(sections, key);
			if (!isValidFieldKey) {
				return;
			}

			newWarnings[key] = value;
		});
		addWarnings(newWarnings);
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFields(getValues());
	}, []);

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
		// attach / fire onValueChange event only when formValidationConfig has values
		// otherwise isValid will be returned incorrectly as true
		if (onValueChange && Object.keys(formValidationConfig || {}).length) {
			const subscription = watch(() => {
				onValueChange(getFormValues(undefined, stripUnknown), checkIsFormValid());
			});
			return () => subscription.unsubscribe();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkIsFormValid, onValueChange, watch, formValidationConfig]);

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
		reset(cloneDeep(defaultValues));
	}, [defaultValues]);

	useDeepCompareEffect(() => {
		setFormSchema(data);
	}, [data || {}]);

	useEffect(() => {
		setCustomComponents(components);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [components]);

	useEffect(() => {
		setSubmitHandler(() => reactFormHookSubmit(handleSubmit, handleSubmitError));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleSubmit, handleSubmitError]);

	useEffect(() => {
		setWrapInForm(wrapInForm);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wrapInForm]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const formId = id ? `frontend-engine-${id}` : "frontend-engine";
	const formClassNames = [className, dataClassName].join(" ").trim();
	const InnerElement = wrapInForm ? "form" : "div";

	if (!data) {
		return (
			<>
				Missing <code>data</code> prop, unable to render Frontend Engine.
			</>
		);
	}

	return (
		<FormProvider {...formMethods}>
			<InnerElement
				id={formId}
				data-testid={id ? TestHelper.generateId(id, "frontend-engine") : formId}
				className={formClassNames}
				noValidate
				onSubmit={reactFormHookSubmit(handleSubmit, handleSubmitError)}
				ref={ref}
			>
				<Sections schema={sections} />
			</InnerElement>
		</FormProvider>
	);
});

/**
 * The one and only component needed to create your form
 *
 * Minimally you will need to set the `data` props which is the JSON schema to define the form
 *
 * Generics
 * - V = custom validation types
 * - C = custom component types
 */
export const FrontendEngine = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => {
	return (
		<ContextProviders>
			<FrontendEngineInner {...props} ref={ref} />
		</ContextProviders>
	);
}) as <V = undefined, C = undefined>(
	props: IFrontendEngineProps<TNoInfer<V, IYupValidationRule>, C> & { ref?: Ref<IFrontendEngineRef> }
) => ReactElement;

/**
 * casting as a function with generics as a way to define generics with forwardRef
 * the generics are a way to set custom definition of Yup validation config
 * `NoInfer` typing is to ensure validation config is either the default `IYupValidationRule` or explicitly typed
 * this prevent inferring from the data props entered by devs
 * can refer to `Add Custom Validation` story for more info
 */
