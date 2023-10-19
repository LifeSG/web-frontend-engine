import { Alert as DSAlert } from "@lifesg/react-design-system/alert";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { IAlertSchema } from "./types";

export const Alert = (props: IGenericElementProps<IAlertSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, ...otherSchema },
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<DSAlert id={id} data-testid={TestHelper.generateId(id, "alert")} {...otherSchema}>
			<Sanitize id={id}>{children}</Sanitize>
		</DSAlert>
	);
};
