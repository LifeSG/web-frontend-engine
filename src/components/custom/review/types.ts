import { UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section/types";
import type { IAlertSchema, ITextSchema } from "../../elements";
import type { IWrapperSchema } from "../../elements/wrapper";
import type { ICustomElementJsonSchema } from "../types";
import { BoxContainerProps } from "@lifesg/react-design-system";

type TReviewSectionChildren = IAlertSchema | ITextSchema | IWrapperSchema;

export type IReviewSchema = IReviewSchemaAccordion | IReviewSchemaDefault;
export interface IReviewBase extends ICustomElementJsonSchema<"review"> {
	label?: string | undefined;
	description?: string | undefined;
	items: UneditableSectionItemProps[];
	topSection?: Record<string, TReviewSectionChildren> | undefined;
	bottomSection?: Record<string, TReviewSectionChildren> | undefined;
}
export interface IReviewSchemaDefault extends IReviewBase {
	variant?: "default" | undefined;
}
export interface IReviewSchemaAccordion
	extends IReviewBase,
		Omit<BoxContainerProps, "children" | "callToActionComponent"> {
	variant: "accodion";
	button: IButtonAccordion | undefined;
}
export interface IButtonAccordion {
	label?: string | undefined;
}
