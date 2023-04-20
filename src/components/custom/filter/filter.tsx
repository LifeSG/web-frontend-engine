import { Filter } from "@lifesg/react-design-system/filter";
import { Wrapper } from "../../elements/wrapper";
import { IFilterProps } from "./types";

export const FilterComponent = (props: IFilterProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { children, label, toggleFilterButtonLabel },
	} = props;

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<Filter toggleFilterButtonLabel={toggleFilterButtonLabel} headerTitle={label}>
			<Wrapper>{children}</Wrapper>
		</Filter>
	);
};
