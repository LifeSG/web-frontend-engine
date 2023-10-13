import { Filter as FilterComponent } from "@lifesg/react-design-system";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import { useFormContext } from "react-hook-form";
import { ObjectHelper, TestHelper } from "../../../../utils";
import { Wrapper } from "../../../elements/wrapper";
import { IGenericCustomElementProps } from "../../types";
import { IFilterCheckboxSchema } from "../filter-checkbox/types";
import { IFilterItemSchema } from "../filter-item/types";
import { IFilterSchema, TClearBehavior } from "./types";

export const Filter = (props: IGenericCustomElementProps<IFilterSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { setValue, getValues, resetField } = useFormContext();

	const {
		id,
		schema: { children, label, toggleFilterButtonLabel, clearButtonDisabled },
	} = props;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getChildrenToClear = () => {
		const formValues = getValues();
		const clearableChildren: Record<string, IFilterItemSchema | IFilterCheckboxSchema> = {};
		const resetChildren: Record<string, IFilterItemSchema | IFilterCheckboxSchema> = {};
		Object.entries(children).forEach(([key, childSchema]) => {
			if (!childSchema.clearBehavior || childSchema.clearBehavior === "clear") {
				clearableChildren[key] = childSchema;
			} else if (childSchema.clearBehavior === "revert") {
				resetChildren[key] = childSchema;
			}
		});

		const childrenToClear: Record<string, { behavior: Omit<TClearBehavior, "retain">; value: unknown }> = {};
		for (const key in formValues) {
			const clearableChild = ObjectHelper.getNestedValueByKey(clearableChildren, key);
			const resetChild = ObjectHelper.getNestedValueByKey(resetChildren, key);
			if (!isEmpty(clearableChild)) {
				childrenToClear[key] = { behavior: "clear", value: formValues[key] };
			}
			if (!isEmpty(resetChild)) {
				childrenToClear[key] = { behavior: "revert", value: formValues[key] };
			}
		}
		return childrenToClear;
	};

	const resetChildrenFormFields = (
		fields: Record<string, { behavior: Omit<TClearBehavior, "retain">; value: unknown }>
	): void => {
		Object.entries(fields).forEach(([key, { behavior, value }]) => {
			if (behavior === "clear") {
				if (isArray(value)) {
					setValue(key, []);
				} else if (isString(value) || isNumber(value)) {
					setValue(key, "");
				}
			} else if (behavior === "revert") {
				resetField(key);
			}
		});
	};

	const clearData = () => {
		const childrenToClear = getChildrenToClear();
		resetChildrenFormFields(childrenToClear);
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<FilterComponent
			data-testid={TestHelper.generateId(id, "filter")}
			toggleFilterButtonLabel={toggleFilterButtonLabel}
			headerTitle={label}
			clearButtonDisabled={clearButtonDisabled}
			onClear={clearData}
		>
			<Wrapper>{children}</Wrapper>
		</FilterComponent>
	);
};
