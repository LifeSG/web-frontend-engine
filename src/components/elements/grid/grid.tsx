import styled from "styled-components";
import { TestHelper } from "../../../utils";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";
import { Layout, V2_Layout } from "@lifesg/react-design-system";

export const Grid = (props: IGenericCustomElementProps<IGridSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================

	const {
		id,
		schema: {
			children,
			customOptions = {
				gridType: "v2",
			},
			uiType: _uiType,
			...rest
		},
	} = props;

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	const Container = customOptions.gridType === "v2" ? V2_Layout.Container : Layout.Container;

	return (
		<GridContainer as={Container} type="grid" data-testid={TestHelper.generateId(id, "grid")} {...rest}>
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
