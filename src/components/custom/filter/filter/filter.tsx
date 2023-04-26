import { Filter as FilterComponent } from "@lifesg/react-design-system";
import { Wrapper } from "../../../elements/wrapper";
import { IFilterProps } from "./types";

export const Filter = (props: IFilterProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { children, label, toggleFilterButtonLabel, onClear, clearButtonDisabled },
	} = props;

	const clearData = () => {
		onClear && onClear();
	}

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<FilterComponent toggleFilterButtonLabel={toggleFilterButtonLabel} headerTitle={label}
			clearButtonDisabled={clearButtonDisabled} onClear={clearData}>
			<Wrapper>{children}</Wrapper>
		</FilterComponent>
	);
};
