import { BoxContainerProps } from "@lifesg/react-design-system/box-container";
import { UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section/types";
import type { IAlertSchema, ITextSchema } from "../../elements";
import type { IWrapperSchema } from "../../elements/wrapper";
import type { ICustomElementJsonSchema } from "../types";

type TReviewSectionChildren = IAlertSchema | ITextSchema | IWrapperSchema;
export type TReviewSchema = IReviewSchemaAccordion | IReviewSchemaBox;

/** @deprecated use TReviewSchema */
export type IReviewSchema = TReviewSchema;

export interface IUnmaskConfig {
	url: string;
	body?: unknown | undefined;
	withCredentials?: boolean | undefined;
}

export interface IReviewItemDetails {
	formattedItem: UneditableSectionItemProps;
	unmask?: IUnmaskConfig | undefined;
	unmaskFailureCount: number;
	unmaskedValue?: string | undefined;
}

// =========================================================================
// COMMON
// =========================================================================
interface IReviewSchemaItemBase extends Pick<UneditableSectionItemProps, "label" | "value" | "displayWidth"> {}

interface IReviewSchemaItem extends IReviewSchemaItemBase {
	disableMaskUnmask?: never | undefined;
	mask?: never | undefined;
	unmask?: never | undefined;
}

interface IReviewSchemaMaskedItem extends IReviewSchemaItemBase {
	disableMaskUnmask?: boolean | undefined;
	mask: "uinfin" | "whole";
	unmask?: IUnmaskConfig | undefined;
}

export type TReviewSchemaItem = IReviewSchemaItem | IReviewSchemaMaskedItem;

interface IReviewBaseSchema {
	label?: string | undefined;
	topSection?: Record<string, TReviewSectionChildren> | undefined;
	bottomSection?: Record<string, TReviewSectionChildren> | undefined;
	items: TReviewSchemaItem[];
}
// =========================================================================
// BOX VARIANT
// =========================================================================
export interface IReviewSchemaBox extends IReviewBaseSchema, ICustomElementJsonSchema<"review"> {
	variant?: "box" | undefined;
	description?: string | undefined;
}

// =========================================================================
// ACCORDION VARIANT
// =========================================================================
export interface IButtonAccordion {
	label?: string | undefined;
}

export interface IReviewSchemaAccordion
	extends IReviewBaseSchema,
		ICustomElementJsonSchema<"review">,
		Omit<BoxContainerProps, "children" | "title" | "callToActionComponent" | "subComponentTestIds"> {
	variant: "accordion";
	button?: false | IButtonAccordion | undefined;
}
