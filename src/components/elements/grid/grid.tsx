import styled from "styled-components";
import { TestHelper } from "../../../utils";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";
import { Layout } from "@lifesg/react-design-system/layout";
import { Spacing } from "@lifesg/react-design-system/theme";

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

const GridContainer = styled(Layout.Container)`
	padding: 0;
	gap: ${Spacing["spacing-32"]};
	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}
`;
