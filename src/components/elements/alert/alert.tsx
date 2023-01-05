import { Alert as DSAlert } from "@lifesg/react-design-system/alert";
import { TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine";
import { Sanitize } from "../../shared";
import { IAlertSchema } from "./types";

export const Alert = (props: IGenericFieldProps<IAlertSchema>) => {
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
