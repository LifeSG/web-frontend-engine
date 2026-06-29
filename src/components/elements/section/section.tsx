import { Layout } from "@lifesg/react-design-system/layout";
import { Wrapper } from "../wrapper";
import * as styles from "./section.styles";
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
	const renderInGrid = () => {
		return (
			<Layout.Section>
				<Layout.Container type="grid" className={styles.gridWrapper}>
					<Wrapper {...otherProps}>{children}</Wrapper>
				</Layout.Container>
			</Layout.Section>
		);
	};

	const renderContained = () => {
		return (
			<Layout.Content>
				<div className={styles.contained}>
					<Wrapper {...otherProps}>{children}</Wrapper>
				</div>
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
