import { Filter as FilterComponent } from "@lifesg/react-design-system";
import { useFormContext } from "react-hook-form";
import { TestHelper } from "../../../../utils";
import { Wrapper } from "../../../elements/wrapper";
import { IFilterProps } from "./types";

export const Filter = (props: IFilterProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================

	const { reset } = useFormContext();

	const {
		id,
		schema: { children, label, toggleFilterButtonLabel, clearButtonDisabled },
	} = props;

	const clearData = () => {
		reset();
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
