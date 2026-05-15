import { Divider as DSDivider } from "@lifesg/react-design-system/divider";
import { TestHelper, filterSchemaProps } from "../../../utils";
import { IGenericElementProps } from "../types";
import { IDividerSchema } from "./types";
import styled from "styled-components";

export const Divider = (props: IGenericElementProps<IDividerSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema } = props;
	const {
		customSchema: { verticalMargin, ...dividerProps },
	} = filterSchemaProps(schema);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<StyledDivider
			id={id}
			data-testid={TestHelper.generateId(id, "divider")}
			$verticalMargin={verticalMargin}
			{...dividerProps}
		/>
	);
};

const StyledDivider = styled(DSDivider)<{ $verticalMargin?: number | undefined }>`
	margin: ${({ $verticalMargin }) => ($verticalMargin ? `${$verticalMargin}rem 0` : "unset")};
`;
