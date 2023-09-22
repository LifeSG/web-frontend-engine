import { UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section/types";
import type { IAlertSchema, ITextSchema } from "../../elements";
import type { IWrapperSchema } from "../../elements/wrapper";
import type { ICustomElementJsonSchema } from "../types";
type TReviewSectionChildren = IAlertSchema | ITextSchema | IWrapperSchema;
export interface IReviewSchema extends ICustomElementJsonSchema<"review"> {
    label?: string | undefined;
    description?: string | undefined;
    items: UneditableSectionItemProps[];
    topSection?: Record<string, TReviewSectionChildren> | undefined;
    bottomSection?: Record<string, TReviewSectionChildren> | undefined;
}
export {};
