import { Filter } from "@lifesg/react-design-system";
import { IFilterItemCheckboxProps } from "./types";

export const FilterItemCheckbox = (props: IFilterItemCheckboxProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options },
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return <Filter.Checkbox title={label} options={options}></Filter.Checkbox>;
};
