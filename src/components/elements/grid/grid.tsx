import { TestHelper } from "../../../utils";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";
import { Layout } from "@lifesg/react-design-system/layout";
import * as styles from "./grid.styles";
import clsx from "clsx";

export const Grid = (props: IGenericCustomElementProps<IGridSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================

	const {
		id,
		schema: { children, uiType: _uiType, className, ...rest },
	} = props;

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<Layout.Container
			type="grid"
			className={clsx(styles.gridContainer, className)}
			data-testid={TestHelper.generateId(id, "grid")}
			{...rest}
		>
			<Wrapper>{children}</Wrapper>
		</Layout.Container>
	);
};
