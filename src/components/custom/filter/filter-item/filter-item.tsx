import { Filter } from "@lifesg/react-design-system";
import { TestHelper } from "../../../../utils";
import { Wrapper } from "../../../elements/wrapper";
import { IGenericFieldProps } from "../../../frontend-engine";
import { IFilterItemSchema } from "./types";

export const FilterItem = (props: IGenericFieldProps<IFilterItemSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		schema: { children, label, collapsible = true, showDivider = true, showMobileDivider = true },
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Filter.Item
			data-testid={TestHelper.generateId(id, "filter-item")}
			title={label}
			collapsible={collapsible}
			showDivider={showDivider}
			showMobileDivider={showMobileDivider}
		>
			<Wrapper>{children}</Wrapper>
		</Filter.Item>
	);
};
