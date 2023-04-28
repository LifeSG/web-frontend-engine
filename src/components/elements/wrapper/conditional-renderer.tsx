import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import React, { useEffect, useState } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { useValidationConfig } from "../../../utils/hooks";
import { TFrontendEngineFieldSchema } from "../../frontend-engine";
import { TFormYupConfig, TRenderRules, TYupSchemaType, YupHelper } from "../../frontend-engine/yup";
import { IFilterItemSchema } from "../../custom/filter/filter-item/types";
import { IFilterItemCheckboxSchema } from "../../custom/filter/filter-item-checkbox/types";

interface IProps {
	id: string;
	renderRules?: TRenderRules[] | undefined;
	children: React.ReactNode;
	schema: TFrontendEngineFieldSchema | IFilterItemSchema | IFilterItemCheckboxSchema;
}

/**
 * conditionally render children according to render rules provided
 * render conditions are based on Yup schema and the base schema is derived from corresponding validation config
 * automatically remove validation config on hide / unmount, for more complex fields, it still has to be done via the field itself
 */
export const ConditionalRenderer = ({ id, renderRules, children, schema }: IProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { watch } = useFormContext();
	const { formValidationConfig, removeFieldValidationConfig } = useValidationConfig();
	const [show, toggleShow] = useState(false);
	const [formValues, setFormValues] = useState<FieldValues>();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const subscription = watch((value) => setFormValues(value));

		return () => subscription.unsubscribe();
	}, [watch]);

	useDeepCompareEffectNoCheck(() => {
		if (isEmpty(renderRules)) return;

		const canShow = canRender();
		if (canShow !== show) {
			if (!canShow) {
				const idsToDelete = [id, ...listAllChildIds(schema?.["children"])];
				idsToDelete.forEach((idToDelete) => removeFieldValidationConfig(idToDelete));
			}
			toggleShow(canShow);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formValidationConfig, formValues, renderRules]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const canRender = () => {
		if (isEmpty(renderRules)) return true;

		let isValid = false;
		renderRules.forEach((ruleGroup) => {
			if (!isValid) {
				const renderSchemaConfig: TFormYupConfig = {};
				Object.entries(ruleGroup).forEach(([fieldId, rules]) => {
					const yupType = formValidationConfig?.[fieldId]?.schema.type as TYupSchemaType;
					if (yupType) {
						let yupBaseSchema = YupHelper.mapSchemaType(yupType);
						// this is to allow empty values in Yup.number schema
						if (yupType === "number") {
							yupBaseSchema = yupBaseSchema
								.nullable()
								.transform((_, value: number) => (!isEmpty(value) ? +value : undefined));
						}
						renderSchemaConfig[fieldId] = { schema: yupBaseSchema, validationRules: rules };
					}
				});
				const renderSchema = YupHelper.buildSchema(renderSchemaConfig);
				try {
					renderSchema.validateSync(formValues);
					isValid = true;
				} catch (error) {}
			}
		});

		return isValid;
	};

	/**
	 * Return all object keys by recursively looping through the object children
	 */
	const listAllChildIds = (children: unknown) => {
		const childIdList: string[] = [];
		if (isEmpty(children) || !isObject(children)) {
			return childIdList;
		}
		Object.keys(children).forEach((id) => {
			childIdList.push(id);
			if (children["children"]) {
				childIdList.push(...listAllChildIds(children["children"]));
			}
		});

		return childIdList;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	if (!isEmpty(renderRules) && !show) return null;
	return <>{children}</>;
};
