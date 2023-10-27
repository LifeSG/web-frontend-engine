import { Layout } from "@lifesg/react-design-system";
import { IGenericCustomElementProps } from "../../custom";
import { Wrapper } from "../wrapper";
import { IGridSchema } from "./types";
import { TestHelper } from "../../../utils";

export const Grid = (props: IGenericCustomElementProps<IGridSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================

	const {
		id,
		schema: { children, uiType, style, ...rest },
	} = props;

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<Layout.Container
			type="grid"
			data-testid={TestHelper.generateId(id, "grid")}
			style={{ padding: 0, gap: "2rem", ...style }}
			{...rest}
		>
			<Wrapper>{children}</Wrapper>
		</Layout.Container>
	);
};
