import { FormLabelProps } from "@lifesg/react-design-system/form/types";
import isArray from "lodash/isArray";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import { useEffect } from "react";
import {
	Controller,
	ControllerFieldState,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	useFormContext,
} from "react-hook-form";
import { useFormSchema, useFormValues, useValidationConfig } from "../../../utils/hooks";
import { IComplexLabel } from "../../fields";
import { TFrontendEngineFieldSchema } from "../../frontend-engine/types";

interface IProps {
	id: string;
	schema: TFrontendEngineFieldSchema;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Field: React.ComponentType<any>;
}

export const FieldWrapper = ({ Field, id, schema }: IProps) => {
	// =========================================================================
	// CONST, STATE, REFS
	// =========================================================================
	const { control, setValue } = useFormContext();

	const {
		formSchema: { defaultValues, restoreMode = "none" },
	} = useFormSchema();
	const { getField, setField, setRegisteredFields } = useFormValues();
	const { removeFieldValidationConfig } = useValidationConfig();

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		setValue(id, getField(id));
		setRegisteredFields((prev) => [...prev, id]);

		return () => {
			switch (restoreMode) {
				case "default-value":
					setField(id, defaultValues?.[id]);
					break;
				case "none": {
					const value = getField(id);
					if (isArray(value)) {
						setField(id, []);
					} else if (isString(value) || isNumber(value)) {
						setField(id, "");
					}
					break;
				}
			}
			setRegisteredFields((prev) => prev.filter((fieldId) => fieldId !== id));
			removeFieldValidationConfig(id);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// =========================================================================
	// HELPER FUNCTIONS
	// =========================================================================
	const constructFormattedLabel = (id: string, schema: TFrontendEngineFieldSchema): string | FormLabelProps => {
		const label: string | IComplexLabel = schema["label"];
		if (typeof label === "string") {
			return label;
		} else if (typeof label === "object" && label.mainLabel) {
			return {
				children: label.mainLabel,
				subtitle: label.subLabel,
				// acccept tooltip type when it's ready
				addon: label.hint?.content
					? /* eslint-disable indent */
					  {
							type: "popover",
							content: label.hint?.content,
							"data-testid": schema["data-testid"] || id,
					  }
					: /* eslint-enable indent */
					  undefined,
			};
		}
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	const renderField = ({
		field,
		fieldState,
	}: {
		field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
		fieldState: ControllerFieldState;
	}) => {
		const fieldProps = {
			...field,
			id,
			formattedLabel: constructFormattedLabel(id, schema),
			value: getField(id),
			ref: undefined, // not passing ref because not all components have fields to be manipulated
		};
		return <Field schema={schema} {...fieldProps} {...fieldState} />;
	};

	return <Controller control={control} name={id} shouldUnregister={true} render={renderField} />;
};
