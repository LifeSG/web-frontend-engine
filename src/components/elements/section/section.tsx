import { Layout } from "@lifesg/react-design-system/layout";
import { Wrapper } from "../wrapper";
import { ISectionProps } from "./types";
import styled from "styled-components";

export const Section = (props: ISectionProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		sectionSchema: { children, layoutType },
		...otherProps
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	if (layoutType === "grid") {
		return (
			<GridContainer type="grid">
				<Wrapper {...otherProps}>{children}</Wrapper>
			</GridContainer>
		);
	}

	return <Wrapper {...otherProps}>{children}</Wrapper>;
};

const GridContainer = styled(Layout.Container)`
	padding: 0;
	gap: 2rem;
	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;
