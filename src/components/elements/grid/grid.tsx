import styled from "styled-components";
import { TestHelper } from "../../../utils";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";
import { Layout } from "@lifesg/react-design-system/layout";
import { V2_Layout } from "@lifesg/react-design-system/v2_layout";
import { Spacing } from "@lifesg/react-design-system/theme";
import { V2_MediaQuery } from "@lifesg/react-design-system/v2_media";

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
	const Container = customOptions.gridType === "v3" ? GridContainer : V2GridContainer;
	const type = customOptions.gridType === "v3" ? "grid" : "flex";

	return (
		<Container type={type} data-testid={TestHelper.generateId(id, "grid")} {...rest}>
			<Wrapper>{children}</Wrapper>
		</Container>
	);
};

const GridContainer = styled(Layout.Container)`
	padding: 0;
	gap: ${Spacing["spacing-32"]};
	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}
`;

const V2GridContainer = styled(Layout.Container)`
	padding: 0;
	gap: ${Spacing["spacing-32"]};
	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}

	display: grid;
	grid-template-columns: repeat(12, minmax(0, 1fr));

	${V2_MediaQuery.MaxWidth.tablet} {
		grid-template-columns: repeat(8, minmax(0, 1fr));
	}

	${V2_MediaQuery.MaxWidth.mobileL} {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
`;
