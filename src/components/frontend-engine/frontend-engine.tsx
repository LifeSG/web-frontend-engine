import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useValidationSchema } from "src/utils/hooks";
import * as FrontendEngineFields from "../fields";
import {
	FieldType,
	IFrontendEngineProps,
	IFrontendEngineRef,
	TFrontendEngineFieldSchema,
	TFrontendEngineValues,
} from "./types";
import { ValidationProvider } from "./validation-schema";

const FrontendEngineInner = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		data: {
			className: dataClassName,
			defaultValues,
			fields: fieldData,
			id,
			revalidationMode = "onChange",
			validationMode = "onSubmit",
		},
		className,
		onSubmit,
	} = props;

	const [fields, setFields] = useState<JSX.Element[]>([]);
	const { validationSchema } = useValidationSchema();

	const {
		control,
		watch,
		formState,
		handleSubmit: reactFormHookSubmit,
	} = useForm({
		mode: validationMode,
		reValidateMode: revalidationMode,
		defaultValues,
		resolver: yupResolver(validationSchema),
	});

	// =============================================================================
	// EFFECTS
	// =============================================================================
	const buildFieldsFromSchema = useCallback(
		(fields: TFrontendEngineFieldSchema[]) =>
			fields.map((customField) => {
				if (Object.keys(FieldType).includes(customField.type)) {
					const Field = FrontendEngineFields[FieldType[customField.type]];

					return (
						<Controller
							control={control}
							key={customField.id}
							name={customField.id}
							render={({ field, fieldState }) => (
								<Field schema={customField} {...field} {...fieldState} />
							)}
						/>
					);
				}
				return <div key={customField.id}>This component is not supported by the engine</div>;
			}),
		[control]
	);

	useEffect(() => {
		setFields(buildFieldsFromSchema(fieldData));
	}, [buildFieldsFromSchema, fieldData]);

	// TODO: Remove logging
	useEffect(() => {
		const subscription = watch((value, { name, type }) => console.log(value, name, type));

		return () => subscription.unsubscribe();
	}, [watch]);

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
		console.log(data); // TODO: remove
		onSubmit?.(data);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const formId = id ? `frontend-engine-${id}` : "frontend-engine";

	return (
		<form
			id={formId}
			data-testid={formId}
			className={`${className} ${dataClassName}`}
			noValidate
			onSubmit={reactFormHookSubmit(handleSubmit)}
			ref={ref}
		>
			{fields}
		</form>
	);
});

export const FrontendEngine = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => (
	<ValidationProvider>
		<FrontendEngineInner {...props} ref={ref} />
	</ValidationProvider>
));
