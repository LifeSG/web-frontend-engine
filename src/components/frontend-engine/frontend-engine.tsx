import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useValidationSchema } from "src/utils/hooks";
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
		onSubmit,
	} = props;

	const { validationSchema } = useValidationSchema();

	const formMethods = useForm({
		mode: validationMode,
		reValidateMode: revalidationMode,
		defaultValues: defaultValues,
		resolver: yupResolver(validationSchema),
	});
	const { handleSubmit: reactFormHookSubmit, formState } = formMethods;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	useImperativeHandle<Partial<IFrontendEngineRef>, Partial<IFrontendEngineRef>>(ref, () => ({
		getFormState: () => {
			return formState;
		},
		submit: () => {
			reactFormHookSubmit(handleSubmit)();
		},
	}));

	const handleSubmit = (data: TFrontendEngineValues) => {
		onSubmit?.(data);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const formId = id ? `frontend-engine-${id}` : "frontend-engine";
	const formClassNames = [className, dataClassName].join(" ").trim();

	return (
		<FormProvider {...formMethods}>
			<form
				id={formId}
				data-testid={formId}
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
