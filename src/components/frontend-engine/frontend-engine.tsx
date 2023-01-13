import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, ReactElement, Ref, useCallback, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { TestHelper } from "../../utils";
import { useFieldEvent, useValidationSchema } from "../../utils/hooks";
import { Wrapper } from "../elements/wrapper";
import { IFrontendEngineProps, IFrontendEngineRef, TFrontendEngineValues } from "./types";
import { IYupValidationRule, YupHelper, YupProvider } from "./yup";
import { EventProvider } from "./event";

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

	const { validationSchema } = useValidationSchema();
	const { addFieldEventListener, removeFieldEventListener } = useFieldEvent();

	const formMethods = useForm({
		mode: validationMode,
		reValidateMode: revalidationMode,
		defaultValues,
		resolver: yupResolver(validationSchema),
	});
	const { reset, watch, handleSubmit: reactFormHookSubmit, getValues } = formMethods;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	useImperativeHandle<Partial<IFrontendEngineRef>, Partial<IFrontendEngineRef>>(ref, () => ({
		addCustomValidation: YupHelper.addCondition,
		addFieldEventListener,
		getValues,
		isValid: checkIsFormValid,
		removeFieldEventListener,
		submit: reactFormHookSubmit(handleSubmit),
	}));

	const checkIsFormValid = useCallback(() => {
		try {
			validationSchema.validateSync(getValues());
			return true;
		} catch (error) {
			return false;
		}
	}, [getValues, validationSchema]);

	const handleSubmit = (data: TFrontendEngineValues) => {
		onSubmit?.(data);
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
	}, [checkIsFormValid, onChange, watch]);

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
				<Wrapper>{fields}</Wrapper>
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
			<EventProvider>
				<FrontendEngineInner {...props} ref={ref} />
			</EventProvider>
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
