import { useRef } from "react";
import { useApplyStyle } from "@lifesg/react-design-system/theme";
import { TestHelper, filterSchemaProps } from "../../../utils";
import { IGenericElementProps } from "../types";
import { IDividerSchema } from "./types";
import { Container, StyledDivider, tokens } from "./divider.styles";

export const Divider = (props: IGenericElementProps<IDividerSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema } = props;
	const {
		customSchema: { verticalMargin, ...dividerProps },
	} = filterSchemaProps(schema);
	const containerRef = useRef<HTMLDivElement>(null);

	useApplyStyle(containerRef, {
		[tokens.container.verticalMargin]: verticalMargin ? `${verticalMargin}rem 0` : undefined,
	});

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Container ref={containerRef}>
			<StyledDivider id={id} data-testid={TestHelper.generateId(id, "divider")} {...dividerProps} />
		</Container>
	);
};
