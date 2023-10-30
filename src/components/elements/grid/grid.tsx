import { Layout } from "@lifesg/react-design-system/layout";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";
import { TestHelper } from "../../../utils";
import styled from "styled-components";

const GridContainer = styled(Layout.Container)`
	padding: 0;
	gap: 2rem;
`;

export const Grid = (props: IGenericCustomElementProps<IGridSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================

	const {
		id,
		schema: { children, uiType, ...rest },
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
