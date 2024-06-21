import { BoxContainerSubComponentTestIds } from "@lifesg/react-design-system/box-container";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
import { IWrapperSchema } from "../wrapper";

export interface IButtonAccordion {
	label: string | undefined;
}

export interface IAccordionSchema<V = undefined, C = undefined>
	extends IBaseElementSchema<"accordion">,
		TComponentOmitProps<IWrapperSchema> {
	uiType: "accordion";
	button?: false | IButtonAccordion;
	children: Record<string, TFrontendEngineFieldSchema<V, C>>;
	className?: string | undefined;
	"data-testid"?: string | undefined;
	subComponentTestIds?: BoxContainerSubComponentTestIds | undefined;
	collapsible?: boolean | undefined;
	expanded?: boolean | undefined;
	displayState?: "default" | "error" | "warning" | undefined;
	title: string;
}

export interface IAccordionProps {
	id: string;
	schema: IAccordionSchema;
}
