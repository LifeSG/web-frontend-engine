import { Alert as DSAlert } from "@lifesg/react-design-system/alert";
import React from "react";
import { TestHelper } from "../../../utils";
import { TFrontendEngineFieldSchema } from "../../frontend-engine";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { Wrapper } from "../wrapper";
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
	const renderContent = () => {
		if (typeof children === "string") {
			return <Sanitize id={id}>{children}</Sanitize>;
		}

		if (
			React.isValidElement(children) ||
			Array.isArray(children) ||
			typeof children === "number" ||
			typeof children === "boolean" ||
			typeof children == undefined
		) {
			return children as React.ReactNode;
		}

		return <Wrapper>{children as Record<string, TFrontendEngineFieldSchema>}</Wrapper>;
	};

	return (
		<DSAlert id={id} data-testid={TestHelper.generateId(id, "alert")} {...otherSchema}>
			{renderContent()}
		</DSAlert>
	);
};
