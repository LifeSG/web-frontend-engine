import { FormLabelProps } from "@lifesg/react-design-system/form";
import isArray from "lodash/isArray";
import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import { useEffect, useRef } from "react";
import {
	Controller,
	ControllerFieldState,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	useFormContext,
} from "react-hook-form";
import { useWhenDependencyMap } from "../../../context-providers";
import {
	useFormSchema,
	useFormValues,
	useIsomorphicDeepLayoutEffect,
	useValidationConfig,
	useWhenRevalidation,
} from "../../../utils/hooks";
import { IComplexLabel } from "../../fields";
import { TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { Sanitize } from "../../shared";
import * as styles from "./field-wrapper.styles";

interface IProps {
	id: string;
	schema: TFrontendEngineFieldSchema;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Field: React.ComponentType<any>;
	warning?: string | undefined;
}

export const FieldWrapper = ({ Field, id, schema, warning }: IProps) => {
	const { control, setValue } = useFormContext();
	const {
		formSchema: { defaultValues, restoreMode = "none" },
	} = useFormSchema();
	const { getField, setField, setRegisteredFields } = useFormValues();
	const { removeFieldValidationConfig } = useValidationConfig();
	const whenDependencyMap = useWhenDependencyMap();
	useWhenRevalidation(id, whenDependencyMap);
	const restoreModeRef = useRef(restoreMode);

	useEffect(() => {
		restoreModeRef.current = restoreMode;
	}, [restoreMode]);

	useIsomorphicDeepLayoutEffect(() => {
		setValue(id, getField(id));
		setRegisteredFields((prev) => [...prev, id]);

		return () => {
			switch (restoreModeRef.current) {
				case "default-value":
					setField(id, defaultValues?.[id]);
					break;
				case "none": {
					const value = getField(id);
					if (isArray(value)) {
						setField(id, []);
					} else if (isString(value)) {
						setField(id, "");
					} else if (isNumber(value) || isBoolean(value)) {
						setField(id, undefined);
					}
					break;
				}
			}
			setRegisteredFields((prev) => prev.filter((fieldId) => fieldId !== id));
			removeFieldValidationConfig(id);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const constructFormattedLabel = (
		id: string,
		schema: TFrontendEngineFieldSchema
	): React.ReactNode | FormLabelProps => {
		const label: string | IComplexLabel = schema["label"];
		if (label && typeof label === "string") {
			return {
				children: <Sanitize inline>{label}</Sanitize>,
			};
		} else if (!!label && typeof label === "object" && label.mainLabel) {
			return {
				children: <Sanitize inline>{label.mainLabel}</Sanitize>,
				subtitle: (
					<Sanitize className={styles.sublabel} id={`${id}-label-subtitle`}>
						{label.subLabel}
					</Sanitize>
				),
				addon: label.hint?.content
					? {
							type: "popover",
							content: <Sanitize className={styles.hint}>{label.hint?.content}</Sanitize>,
							"data-testid": (schema["data-testid"] || id) + "-popover",
							zIndex: label.hint?.zIndex,
					  }
					: undefined,
			};
		}
	};

	const renderField = ({
		field,
		fieldState,
	}: {
		field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
		fieldState: ControllerFieldState;
	}) => {
		const { ref: _ref, ...fieldPropsWithoutRef } = field;

		const fieldProps = {
			...fieldPropsWithoutRef,
			id,
			formattedLabel: constructFormattedLabel(id, schema),
			value: getField(id),
			warning,
		};
		return <Field schema={schema} {...fieldProps} {...fieldState} />;
	};

	return <Controller control={control} name={id} shouldUnregister={true} render={renderField} />;
};
