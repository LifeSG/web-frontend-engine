import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TestHelper } from "../../utils";
import { useValidationSchema } from "../../utils/hooks";
import { Wrapper } from "../fields/wrapper";
import { IFrontendEngineProps, IFrontendEngineRef, TFrontendEngineValues } from "./types";
import { YupProvider } from "./yup";

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

	const formMethods = useForm({
		mode: validationMode,
		reValidateMode: revalidationMode,
		defaultValues: defaultValues,
		resolver: yupResolver(validationSchema),
	});
	const { watch, handleSubmit: reactFormHookSubmit, getValues } = formMethods;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	useImperativeHandle<Partial<IFrontendEngineRef>, Partial<IFrontendEngineRef>>(ref, () => ({
		getValues,
		isValid: checkIsFormValid,
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
		console.log(data); // TODO: remove
		onSubmit?.(data);
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const subscription = watch((value) => onChange?.(value, checkIsFormValid()));

		return () => subscription.unsubscribe();
	}, [checkIsFormValid, onChange, watch]);

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

export const FrontendEngine = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => (
	<YupProvider>
		<FrontendEngineInner {...props} ref={ref} />
	</YupProvider>
));
