import { Layout } from "@lifesg/react-design-system/layout";
import { Wrapper } from "../wrapper";
import { Contained, GridWrapper } from "./section.styles";
import { ISectionProps } from "./types";

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
	const renderInGrid = () => (
		<Layout.Section>
			<GridWrapper type="grid">
				<Wrapper {...otherProps}>{children}</Wrapper>
			</GridWrapper>
		</Layout.Section>
	);

	const renderContained = () => (
		<Layout.Content>
			<Contained>
				<Wrapper {...otherProps}>{children}</Wrapper>
			</Contained>
		</Layout.Content>
	);

	const renderDefault = () => <Wrapper {...otherProps}>{children}</Wrapper>;

	switch (layoutType) {
		case "grid":
			return renderInGrid();
		case "contain":
			return renderContained();
		default:
			return renderDefault();
	}
};
