import { Filter } from "@lifesg/react-design-system";
import { Wrapper } from "../../../elements/wrapper";
import { IFilterItemProps } from "./types";

export const FilterItem = (props: IFilterItemProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { children, label, collapsible = true, showDivider = true, showMobileDivider = true },
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Filter.Item
			title={label}
			collapsible={collapsible}
			showDivider={showDivider}
			showMobileDivider={showMobileDivider}
		>
			<Wrapper>{children}</Wrapper>
		</Filter.Item>
	);
};
