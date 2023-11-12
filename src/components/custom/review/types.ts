import { BoxContainerProps } from "@lifesg/react-design-system/box-container";
import { UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section/types";
import type { IAlertSchema, ITextSchema } from "../../elements";
import type { IWrapperSchema } from "../../elements/wrapper";
import type { ICustomElementJsonSchema } from "../types";

type TReviewSectionChildren = IAlertSchema | ITextSchema | IWrapperSchema;

export type IReviewSchema = IReviewSchemaAccordion | IReviewSchemaBox;
export interface IReviewBase extends ICustomElementJsonSchema<"review"> {
	items: UneditableSectionItemProps[];
}
export interface IReviewSchemaBox extends IReviewBase {
	label?: string | undefined;
	variant?: "box" | undefined;
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
