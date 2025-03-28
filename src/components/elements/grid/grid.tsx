import { V2_Layout } from "@lifesg/react-design-system/v2_layout";
import styled from "styled-components";
import { TestHelper } from "../../../utils";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";

export const Grid = (props: IGenericCustomElementProps<IGridSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================

	const {
		id,
		schema: { children, uiType: _uiType, ...rest },
	} = props;

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================

	return (
		<GridContainer type="grid" data-testid={TestHelper.generateId(id, "grid")} {...rest}>
			<Wrapper>{children}</Wrapper>
		</GridContainer>
	);
};

const GridContainer = styled(V2_Layout.Container)`
	padding: 0;
	gap: 2rem;
	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;
