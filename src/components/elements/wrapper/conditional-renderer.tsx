import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { TFormYupConfig, TRenderRules, TYupSchemaType, YupHelper } from "../../../context-providers";
import { useFormValues, useValidationConfig } from "../../../utils/hooks";
import { IFilterCheckboxSchema } from "../../custom/filter/filter-checkbox/types";
import { IFilterItemSchema } from "../../custom/filter/filter-item/types";
import { TCheckboxGroupSchema, TRadioButtonGroupSchema } from "../../fields";
import { TFrontendEngineFieldSchema } from "../../frontend-engine";

interface IProps {
	id: string;
	renderRules?: TRenderRules[] | undefined;
	children: React.ReactNode;
	schema: TFrontendEngineFieldSchema | IFilterItemSchema | IFilterCheckboxSchema;
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
	const { formValidationConfig, removeFieldValidationConfig } = useValidationConfig();
	const [show, toggleShow] = useState(undefined);
	const { formValues } = useFormValues();
	const { unregister } = useFormContext();

	useDeepCompareEffectNoCheck(() => {
		if (isEmpty(renderRules)) return;

		const canShow = canRender();
		if (canShow !== show) {
			if (!canShow) {
				const idsToDelete = [id, ...listAllChildIds(schema)];
				idsToDelete.forEach((idToDelete) => {
					removeFieldValidationConfig(idToDelete);
					unregister(idToDelete);
				});
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
	const listAllChildIds = (schema: IProps["schema"]) => {
		const children = schema["children"];
		const childIdList: string[] = [];

		// Handle special fields that render additional fields
		switch (schema.uiType) {
			case "chips":
				childIdList.push(id + "-textarea");
				break;
			case "checkbox":
			case "radio":
				(schema as TCheckboxGroupSchema | TRadioButtonGroupSchema).options.forEach((option) => {
					const optionChildren = option["children"];
					if (!isEmpty(optionChildren) && isObject(optionChildren)) {
						Object.entries(optionChildren).forEach(([id, child]) => {
							childIdList.push(id);
							if (child["children"]) {
								childIdList.push(...listAllChildIds(child["children"]));
							}
						});
					}
				});
				break;
		}

		// Handle nested fields
		if (isEmpty(children) || !isObject(children)) {
			return childIdList;
		}
		Object.entries(children).forEach(([id, child]) => {
			childIdList.push(id);
			if (child["children"]) {
				childIdList.push(...listAllChildIds(child["children"]));
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
