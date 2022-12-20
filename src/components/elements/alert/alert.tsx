import { Alert as DSAlert } from "@lifesg/react-design-system/alert";
import { TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine";
import { IAlertSchema } from "./types";

export const Alert = (props: IGenericFieldProps<IAlertSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema } = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return <DSAlert id={id} data-testid={TestHelper.generateId(id, "alert")} {...schema} />;
};
