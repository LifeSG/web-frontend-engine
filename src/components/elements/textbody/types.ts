import { TextProps } from "@lifesg/react-design-system/text";
import { IFrontendEngineBaseFieldJsonSchema, TFrontendEngineBaseFieldJsonSchemaKeys } from "../../frontend-engine";

export interface ITextbodySchema
	extends Omit<IFrontendEngineBaseFieldJsonSchema<"textbody">, "label">,
		Omit<TextProps, TFrontendEngineBaseFieldJsonSchemaKeys | "children"> {
	validation?: never;
	children: string | string[] | Record<string, ITextbodySchema>;
	hasNestedFields?: boolean; // NOTE: Used to explicitly change <p> to <div> upon creation of component
}
