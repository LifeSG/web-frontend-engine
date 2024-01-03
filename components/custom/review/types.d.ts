import { BoxContainerProps } from "@lifesg/react-design-system/box-container";
import { UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section/types";
import type { IAlertSchema, ITextSchema } from "../../elements";
import type { IWrapperSchema } from "../../elements/wrapper";
import type { ICustomElementJsonSchema } from "../types";
type TReviewSectionChildren = IAlertSchema | ITextSchema | IWrapperSchema;
export type IReviewSchema = IReviewSchemaAccordion | IReviewSchemaBox;
export interface IReviewSchemaBox extends ICustomElementJsonSchema<"review"> {
    label?: string | undefined;
    variant?: "box" | undefined;
    description?: string | undefined;
    topSection?: Record<string, TReviewSectionChildren> | undefined;
    bottomSection?: Record<string, TReviewSectionChildren> | undefined;
    items: UneditableSectionItemProps[];
}
export interface IReviewSchemaAccordionItem extends UneditableSectionItemProps {
    mask?: "uinfin" | "whole" | undefined;
}
export interface IReviewSchemaAccordion extends ICustomElementJsonSchema<"review">, Omit<BoxContainerProps, "children" | "title" | "callToActionComponent" | "subComponentTestIds"> {
    label: string;
    variant: "accordion";
    button?: IButtonAccordion | undefined;
    items: IReviewSchemaAccordionItem[];
}
export interface IButtonAccordion {
    label?: string | undefined;
}
export {};
