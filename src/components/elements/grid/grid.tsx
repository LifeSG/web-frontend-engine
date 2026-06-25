import { TestHelper } from "../../../utils";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";
import { Layout } from "@lifesg/react-design-system/layout";
import * as styles from "./grid.styles";

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
		<Layout.Container
			type="grid"
			className={styles.gridContainer}
			data-testid={TestHelper.generateId(id, "grid")}
			{...rest}
		>
			<Wrapper>{children}</Wrapper>
		</Layout.Container>
	);
};
