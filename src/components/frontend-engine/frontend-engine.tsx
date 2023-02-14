import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, ReactElement, Ref, useCallback, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { TestHelper } from "../../utils";
import { useValidationSchema } from "../../utils/hooks";
import { Wrapper } from "../elements/wrapper";
import { IFrontendEngineProps, IFrontendEngineRef, TFrontendEngineValues } from "./types";
import { IYupValidationRule, YupHelper, YupProvider } from "./yup";

const FrontendEngineInner = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		data: {
			className: dataClassName = null,
			defaultValues,
			fields,
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
		setError,
		formState: { errors },
		getFieldState,
		clearErrors,
	} = formMethods;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	useImperativeHandle<Partial<IFrontendEngineRef>, Partial<IFrontendEngineRef>>(ref, () => ({
		getValues,
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

	const setErrors = (errors: Record<string, string>): void => {
		for (const key in errors) {
			if (key in fields) {
				setError(key, { type: "api", message: errors[key] });
			}
		}
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const subscription = watch((value) => {
			if (onChange) {
				onChange(value, checkIsFormValid());
			}

			for (const [key, value] of Object.entries(errors)) {
				const fieldState = getFieldState(key);

				// NOTE: Clear API errors if user updates the field
				if (value["type"] === "api" && fieldState.isDirty) {
					clearErrors(key);
				}
			}
		});

		return () => subscription.unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkIsFormValid, onChange, watch, errors]);

	useDeepCompareEffectNoCheck(() => {
		reset({ ...defaultValues, ...getValues() });
	}, [defaultValues, getValues]);

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
				<Wrapper warnings={warnings}>{fields}</Wrapper>
			</form>
		</FormProvider>
	);
});

/**
 * prevents inferrence
 * https://stackoverflow.com/questions/56687668/a-way-to-disable-type-argument-inference-in-generics
 */
type NoInfer<T, U> = [T][T extends U ? 0 : never];
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
	props: IFrontendEngineProps<NoInfer<V, IYupValidationRule>> & { ref?: Ref<IFrontendEngineRef> }
) => ReactElement;

/**
 * casting as a function with generics as a way to define generics with forwardRef
 * the generics are a way to set custom definition of Yup validation config
 * `NoInfer` typing is to ensure validation config is either the default `IYupValidationRule` or explicitly typed
 * this prevent inferring from the data props entered by devs
 * can refer to `Add Custom Validation` story for more info
 */
