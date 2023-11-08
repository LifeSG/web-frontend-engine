import { BoxContainerProps } from "@lifesg/react-design-system";
import { UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section/types";
import type { IAlertSchema, ITextSchema } from "../../elements";
import type { IWrapperSchema } from "../../elements/wrapper";
import type { ICustomElementJsonSchema } from "../types";

type TReviewSectionChildren = IAlertSchema | ITextSchema | IWrapperSchema;

export type IReviewSchema = IReviewSchemaAccordion | IReviewSchemaDefault;
export interface IReviewBase extends ICustomElementJsonSchema<"review"> {
	items: UneditableSectionItemProps[];
}
export interface IReviewSchemaDefault extends IReviewBase {
	label?: string | undefined;
	variant?: "default" | undefined;
	description?: string | undefined;
	topSection?: Record<string, TReviewSectionChildren> | undefined;
	bottomSection?: Record<string, TReviewSectionChildren> | undefined;
}
export interface IReviewSchemaAccordion
	extends IReviewBase,
		Omit<BoxContainerProps, "children" | "title" | "callToActionComponent" | "subComponentTestIds"> {
	label: string;
	variant: "accordion";
	button?: IButtonAccordion | undefined;
}
export interface IButtonAccordion {
	label?: string | undefined;
}
