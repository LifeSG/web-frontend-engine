import { V2_Layout } from "@lifesg/react-design-system/v2_layout";
import { Wrapper } from "../wrapper";
import { Contained, GridWrapper } from "./section.styles";
import { ISectionProps } from "./types";
import { Layout } from "@lifesg/react-design-system";

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
		switch (customOptions.gridType) {
			case "v3":
				return (
					<Layout.Container>
						<GridWrapper type="grid">
							<Wrapper {...otherProps}>{children}</Wrapper>
						</GridWrapper>
					</Layout.Container>
				);
			case "v2":
			default:
				return (
					<V2_Layout.Container>
						<GridWrapper type="grid">
							<Wrapper {...otherProps}>{children}</Wrapper>
						</GridWrapper>
					</V2_Layout.Container>
				);
		}
	};

	const renderContained = () => (
		<V2_Layout.Content>
			<Contained>
				<Wrapper {...otherProps}>{children}</Wrapper>
			</Contained>
		</V2_Layout.Content>
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
