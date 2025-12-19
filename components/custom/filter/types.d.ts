import { FormLabelAddonProps } from "@lifesg/react-design-system/form/types";
import { TBlockElementSchema, TInlineElementSchema } from "../../elements/types";
import { TWrapperSchema } from "../../elements/wrapper/types";
interface IPopoverHint extends Pick<FormLabelAddonProps, "zIndex"> {
    content: string | Record<string, TBlockElementSchema | TInlineElementSchema | TWrapperSchema>;
}
export interface IFilterItemLabel {
    mainLabel: string;
    hint?: IPopoverHint | undefined;
}
export {};
