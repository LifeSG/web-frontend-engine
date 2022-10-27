import { yupResolver } from "@hookform/resolvers/yup";
import { isArray, isObject, map, some } from "lodash";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useValidationSchema } from "src/utils/hooks";
import * as FrontendEngineFields from "../fields";
import { ISelectOption } from "../fields";
import {
	FieldType,
	IFrontendEngineProps,
	IFrontendEngineRef,
	IGenericFieldProps,
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

	const formMethods = useForm({
		mode: validationMode,
		reValidateMode: revalidationMode,
		defaultValues: defaultValues,
		resolver: yupResolver(validationSchema),
	});
	const { control, watch, handleSubmit: reactFormHookSubmit, formState } = formMethods;

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const fieldComponents: JSX.Element[] = [];
		Object.entries(fieldData).forEach(([id, customField]) => {
			const fieldType = customField.fieldType?.toUpperCase();

			if (Object.keys(FieldType).includes(fieldType)) {
				const Field = FrontendEngineFields[FieldType[fieldType]] as React.ForwardRefExoticComponent<
					IGenericFieldProps<TFrontendEngineFieldSchema>
				>;

				fieldComponents.push(
					<Controller
						control={control}
						key={id}
						name={id}
						render={({ field, fieldState }) => {
							const fieldProps = { ...field, id, ref: undefined }; // not passing ref because not all components have fields to be manipulated
							return <Field schema={customField} {...fieldProps} {...fieldState} />;
						}}
					/>
				);
			}
			return <div key={id}>This component is not supported by the engine</div>;
		});
		setFields(fieldComponents);
	}, [fieldData, control]);

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
		const transformedData = transformData(data);
		console.log(transformedData); // TODO: remove
		onSubmit?.(transformedData);
	};

	/**
	 * NOTE: Transformation of data is required for components like
	 * select and multi-select due to the nature of the options (i.e. refer to IOption)
	 * */
	const transformData = (data: TFrontendEngineValues) => {
		const updatedData = data;
		Object.entries(updatedData).forEach(([key, payload]) => {
			if (payload) {
				if (isArray(payload) && some(payload, containsLabelValue)) {
					data[key] = map(payload, "value");
				} else if (containsLabelValue(payload)) {
					data[key] = payload.value;
				}
			}
		});

		return updatedData;
	};

	const containsLabelValue = (data: ISelectOption | unknown) => {
		return isObject(data) && "value" in data;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const formId = id ? `frontend-engine-${id}` : "frontend-engine";

	return (
		<FormProvider {...formMethods}>
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
		</FormProvider>
	);
});

export const FrontendEngine = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => (
	<ValidationProvider>
		<FrontendEngineInner {...props} ref={ref} />
	</ValidationProvider>
));
