import { V2_Layout } from "@lifesg/react-design-system/v2_layout";
import { Wrapper } from "../wrapper";
import { Contained, GridWrapper } from "./section.styles";
import { ISectionProps } from "./types";
import { Layout } from "@lifesg/react-design-system/layout";

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
				contentType: "v2",
			},
		},
		...otherProps
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderInGrid = () => {
		const Section = customOptions.gridType === "v3" ? Layout.Section : V2_Layout.Section;
		const Container = customOptions.gridType === "v3" ? Layout.Container : V2_Layout.Container;
		return (
			<Section>
				<GridWrapper as={Container} type="grid">
					<Wrapper {...otherProps}>{children}</Wrapper>
				</GridWrapper>
			</Section>
		);
	};

	const renderContained = () => {
		const Content = customOptions.contentType === "v3" ? Layout.Content : V2_Layout.Content;
		return (
			<Content>
				<Contained>
					<Wrapper {...otherProps}>{children}</Wrapper>
				</Contained>
			</Content>
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
