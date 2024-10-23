import { yupResolver } from "@hookform/resolvers/yup";
import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import { ReactElement, Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useDeepCompareEffect, { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import {
	ContextProviders,
	IYupValidationRule,
	TCustomValidationFunction,
	TYupSchemaType,
	YupHelper,
} from "../../context-providers";
import { ObjectHelper, TNoInfer, TestHelper } from "../../utils";
import {
	useCustomComponents,
	useFieldEvent,
	useFormSchema,
	useFormValues,
	useFrontendEngineForm,
	useValidationSchema,
} from "../../utils/hooks";
import { Sections } from "../elements/sections";
import {
	IFrontendEngineProps,
	IFrontendEngineRef,
	TErrorPayload,
	TFrontendEngineValues,
	TWarningPayload,
} from "./types";
import { useFormChange } from "./use-form-change";

const FrontendEngineInner = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { data, className = null, components, onSubmit, onSubmitError, wrapInForm = true } = props;
	const {
		className: dataClassName = null,
		defaultValues,
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
	const { reset, handleSubmit: reactFormHookSubmit, getValues, setValue, setError, trigger, formState } = formMethods;
	const { resetFields, setFields, getFormValues, registeredFields } = useFormValues(formMethods);
	const registeredFieldsRef = useRef(registeredFields); // using ref ensures the latest values can be retrieved in setErrors and setWarnings
	const { checkIsFormValid } = useFormChange(props, formMethods);

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
		validate: trigger,
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

	const setErrors = (errors: TErrorPayload): void => {
		Object.entries(errors).forEach(([key, value]) => {
			const isValidFieldKey = registeredFieldsRef.current.includes(key);
			if (!isValidFieldKey) {
				return;
			}

			if (Array.isArray(value)) {
				setError(key, { type: "api", message: value[0] });
			} else if (typeof value === "object") {
				setError(key, { type: "api", message: JSON.stringify(value) });
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
			const isValidFieldKey = registeredFieldsRef.current.includes(key);
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

	useEffect(() => {
		registeredFieldsRef.current = registeredFields;
	}, [registeredFields]);

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
				<Sections />
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
