import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useValidationSchema } from "src/utils/hooks";
import * as FrontendEngineFields from "../fields";
import { FieldType, IFrontendEngineProps, TFrontendEngineFieldSchema, TFrontendEngineValues } from "./types";
import { ValidationProvider } from "./validation-schema";

const FrontendEngineInner = (props: IFrontendEngineProps) => {
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
		handleSubmit: reactFormHookSubmit,
		formState: { errors },
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
		>
			{fields}
		</form>
	);
};

export const FrontendEngine = (props: IFrontendEngineProps) => (
	<ValidationProvider>
		<FrontendEngineInner {...props} />
	</ValidationProvider>
);
