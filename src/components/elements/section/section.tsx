import { Layout } from "@lifesg/react-design-system/layout";
import { Wrapper } from "../wrapper";
import { Contained, GridWrapper, V2GridWrapper } from "./section.styles";
import { ISectionProps } from "./types";

export const Section = (props: ISectionProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		sectionSchema: {
			children,
			layoutType,
			customOptions = {
				gridType: "v2",
			},
		},
		...otherProps
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderInGrid = () => {
		const LayoutContainer = customOptions.gridType === "v3" ? GridWrapper : V2GridWrapper;
		const type = customOptions.gridType === "v3" ? "grid" : "flex";
		return (
			<Layout.Section>
				<LayoutContainer type={type}>
					<Wrapper {...otherProps}>{children}</Wrapper>
				</LayoutContainer>
			</Layout.Section>
		);
	};

	const renderContained = () => {
		return (
			<Layout.Content>
				<Contained>
					<Wrapper {...otherProps}>{children}</Wrapper>
				</Contained>
			</Layout.Content>
		);
	};

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
