import { Filter as FilterComponent } from "@lifesg/react-design-system";
import _ from "lodash";
import { useFormContext } from "react-hook-form";
import { TestHelper, ObjectHelper } from "../../../../utils";
import { Wrapper } from "../../../elements/wrapper";
import { IFilterProps } from "./types";

export const Filter = (props: IFilterProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================

	const { resetField, getValues } = useFormContext();

	const {
		id,
		schema: { children, label, toggleFilterButtonLabel, clearButtonDisabled },
	} = props;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getChildrenFormControlNamesList = (): string[] => {
		const list = [];
		const formValues = getValues();
		for (const key in formValues) {
			if (!_.isEmpty(ObjectHelper.getNestedValueByKey(children, key))) {
				list.push(key);
			}
		}
		return list;
	};

	const resetChildrenFormFields = (fields: string[]): void => {
		fields.forEach((item) => resetField(item));
	};

	const clearData = () => {
		const fields = getChildrenFormControlNamesList();
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
