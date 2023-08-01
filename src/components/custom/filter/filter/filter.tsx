import { Filter as FilterComponent } from "@lifesg/react-design-system";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import { useFormContext } from "react-hook-form";
import { ObjectHelper, TestHelper } from "../../../../utils";
import { Wrapper } from "../../../elements/wrapper";
import { IFilterCheckboxSchema } from "../filter-checkbox/types";
import { IFilterItemSchema } from "../filter-item/types";
import { IFilterProps } from "./types";

export const Filter = (props: IFilterProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================

	const { setValue, getValues } = useFormContext();

	const {
		id,
		schema: { children, label, toggleFilterButtonLabel, clearButtonDisabled },
	} = props;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getChildrenFormFields = () => {
		const fields: Record<string, IFilterItemSchema | IFilterCheckboxSchema> = {};
		const formValues = getValues();
		for (const key in formValues) {
			const nested = ObjectHelper.getNestedValueByKey(children, key);

			if (!isEmpty(nested)) {
				fields[key] = formValues[key];
			}
		}
		return fields;
	};

	const resetChildrenFormFields = (fields: Record<string, IFilterItemSchema | IFilterCheckboxSchema>): void => {
		Object.entries(fields).forEach(([key, value]) => {
			if (isArray(value)) {
				setValue(key, []);
			} else if (isString(value) || isNumber(value)) {
				setValue(key, "");
			}
		});
	};

	const clearData = () => {
		const fields = getChildrenFormFields();
		resetChildrenFormFields(fields);
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
