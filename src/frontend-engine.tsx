import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import * as FrontendEngineFields from "./components";
import { StyledForm } from "./styles";
import { FieldType, IFrontendEngineProps, TFrontendEngineFieldSchema } from "./types";
import { SchemaHelper } from "./utils";

export const FrontendEngine = (props: IFrontendEngineProps) => {
	// ================================================
	// CONST, STATE, REFS
	// ================================================
	const {
		id,
		className = "",
		data,
		defaultValues,
		validationSchema,
		validators,
		conditions,
		validationMode,
		reValidationMode,
		onSubmit,
		onValidate,
	} = props;

	const [fields, setFields] = useState<JSX.Element[]>([]);
	const [formValidationSchema, setFormValidationSchema] = useState<AnyObjectSchema>(null);
	const {
		control,
		watch,
		handleSubmit: reactFormHookSubmit,
		formState: { errors },
	} = useForm({
		mode: validationMode,
		reValidateMode: reValidationMode || "onChange",
		defaultValues: defaultValues,
		resolver: yupResolver(formValidationSchema),
	});

	// ================================================
	// EFFECTS
	// ================================================
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
		[]
	);
	useEffect(() => {
		if (data) {
			setFields(buildFieldsFromSchema(data.fields));
			setFormValidationSchema(validationSchema || SchemaHelper.buildValidationFromJson(data, validators));
		}
	}, [buildFieldsFromSchema, data, validationSchema, validators]);

	// TODO: Remove logging
	useEffect(() => {
		const subscription = watch((value, { name, type }) => console.log(value, name, type));

		return () => subscription.unsubscribe();
	}, [watch]);

	// ================================================
	// HELPER FUNCTIONS
	// ================================================
	const handleOnSubmit = (data: any) => {
		console.log(data);
		onSubmit && onSubmit();
	};

	const formatFormId = () => {
		let formId = "frontend-engine";

		if (id) formId = `frontend-engine-${id}`;
		else if (className) formId = `frontend-engine-${className}`;

		return formId;
	};

	return (
		<StyledForm
			id={formatFormId()}
			data-testid={formatFormId()}
			className={className}
			noValidate
			onSubmit={reactFormHookSubmit(handleOnSubmit)}
		>
			{fields}
			<input type="submit" />
		</StyledForm>
	);
};
