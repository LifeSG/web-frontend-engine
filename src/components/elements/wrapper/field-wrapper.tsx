import { Colour, Font } from "@lifesg/react-design-system/theme";
import { FormLabelProps } from "@lifesg/react-design-system/form/types";
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
import styled from "styled-components";
import { useFormSchema, useFormValues, useIsomorphicDeepLayoutEffect, useValidationConfig } from "../../../utils/hooks";
import { IComplexLabel } from "../../fields";
import { TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { Sanitize } from "../../shared";

interface IProps {
	id: string;
	schema: TFrontendEngineFieldSchema;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Field: React.ComponentType<any>;
	warning?: string | undefined;
}

export const FieldWrapper = ({ Field, id, schema, warning }: IProps) => {
	// =========================================================================
	// CONST, STATE, REFS
	// =========================================================================
	const { control, setValue } = useFormContext();

	const {
		formSchema: { defaultValues, restoreMode = "none" },
	} = useFormSchema();
	const { getField, setField, setRegisteredFields } = useFormValues();
	const { removeFieldValidationConfig } = useValidationConfig();
	const restoreModeRef = useRef(restoreMode);

	// =========================================================================
	// EFFECTS
	// =========================================================================
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

	// =========================================================================
	// HELPER FUNCTIONS
	// =========================================================================
	const constructFormattedLabel = (
		id: string,
		schema: TFrontendEngineFieldSchema
	): React.ReactNode | FormLabelProps => {
		const label: string | IComplexLabel = schema["label"];
		if (typeof label === "string") {
			return {
				children: <Sanitize inline>{label}</Sanitize>,
			};
		} else if (!!label && typeof label === "object" && label.mainLabel) {
			return {
				children: <Sanitize inline>{label.mainLabel}</Sanitize>,
				subtitle: <StyledSublabel className="sub-label">{label.subLabel}</StyledSublabel>,
				// acccept tooltip type when it's ready
				addon: label.hint?.content
					? /* eslint-disable indent */
					  {
							type: "popover",
							content: <StyledHint className="label-hint">{label.hint?.content}</StyledHint>,
							"data-testid": (schema["data-testid"] || id) + "-popover",
							zIndex: label.hint?.zIndex,
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
		// not passing ref because not all components have fields to be manipulated
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

const StyledSublabel = styled(Sanitize)`
	&.sub-label {
		display: block;
		${Font["body-md-regular"]};
	}
`;

const StyledHint = styled(Sanitize)`
	&.label-hint {
		color: ${Colour.text};
		${Font["body-md-regular"]};
	}
`;
