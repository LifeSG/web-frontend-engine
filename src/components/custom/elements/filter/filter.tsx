import { Filter as FilterComponent } from "@lifesg/react-design-system/filter";
import { Wrapper } from "../../../elements/wrapper";
import { IFilterProps } from "./types";

export const Filter = (props: IFilterProps) => {
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
		<FilterComponent toggleFilterButtonLabel={toggleFilterButtonLabel} headerTitle={label}>
			<Wrapper>{children}</Wrapper>
		</FilterComponent>
	);
};
