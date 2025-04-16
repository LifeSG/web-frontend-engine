import styled from "styled-components";
import { TestHelper } from "../../../utils";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";
import { Layout } from "@lifesg/react-design-system/layout";
import { V2_Layout } from "@lifesg/react-design-system/v2_layout";

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
	const Container = customOptions.gridType === "v3" ? Layout.Container : V2_Layout.Container;

	return (
		<GridContainer as={Container} type="grid" data-testid={TestHelper.generateId(id, "grid")} {...rest}>
			<Wrapper>{children}</Wrapper>
		</GridContainer>
	);
};

const GridContainer = styled(Layout.Container)`
	padding: 0;
	gap: 2rem;
	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;
