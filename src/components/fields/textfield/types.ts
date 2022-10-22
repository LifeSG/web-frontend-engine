import { FormInputProps } from "@lifesg/react-design-system/form/types";
import React from "react";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ITextfieldSchema
	extends IFrontendEngineBaseFieldJsonSchema<"TEXT" | "NUMBER" | "EMAIL">,
		Omit<FormInputProps, TFrontendEngineBaseFieldJsonSchemaKeys> {}

export type TInputMode = Pick<React.HTMLAttributes<HTMLInputElement>, "inputMode">;
