import { TFrontendEngineBaseFieldJsonSchemaKeys, TFrontendEngineFieldSchema } from "../../frontend-engine";

export type TWrapperType =
	| "div"
	| "span"
	| "section"
	| "header"
	| "footer"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "p";

export interface IWrapperSchema
	extends Omit<React.HTMLAttributes<HTMLElement>, TFrontendEngineBaseFieldJsonSchemaKeys | "children"> {
	fieldType: TWrapperType;
	children: Record<string, TFrontendEngineFieldSchema> | string;
}
