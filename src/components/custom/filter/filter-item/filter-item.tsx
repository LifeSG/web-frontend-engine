import { Filter } from "@lifesg/react-design-system/filter";
import { useEffect, useState } from "react";
import { TestHelper } from "../../../../utils";
import { Wrapper } from "../../../elements/wrapper";
import { IGenericCustomElementProps } from "../../types";
import { FilterHelper } from "../filter-helper";
import { IFilterItemSchema } from "./types";

export const FilterItem = (props: IGenericCustomElementProps<IFilterItemSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		schema: { children, label, collapsible = true, showDivider = true, showMobileDivider = true, expanded = false },
	} = props;

	const [expandedState, setExpandedState] = useState(expanded);
	const { title, addon } = FilterHelper.constructFormattedLabel(label, id);

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		setExpandedState(expanded);
	}, [expanded]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Filter.Item
			data-testid={TestHelper.generateId(id, "filter-item")}
			title={title}
			addon={addon}
			collapsible={collapsible}
			showDivider={showDivider}
			showMobileDivider={showMobileDivider}
			expanded={expandedState}
			onExpandChange={setExpandedState}
		>
			<Wrapper>{children}</Wrapper>
		</Filter.Item>
	);
};
