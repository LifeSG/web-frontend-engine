import { FormInputProps, FormMaskedInputProps } from "@lifesg/react-design-system/form/types";
import * as Icons from "@lifesg/react-icons";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";
interface IMaskedFieldProps extends Pick<FormMaskedInputProps, "maskChar" | "maskRange" | "unmaskRange" | "iconActiveColor" | "iconInactiveColor" | "transformInput"> {
    maskRegex?: string | undefined;
    iconMask?: keyof typeof Icons | undefined;
    iconUnmask?: keyof typeof Icons | undefined;
}
export interface IMaskedFieldSchema<V = undefined> extends IBaseFieldSchema<"masked-field", V>, TComponentOmitProps<FormInputProps & IMaskedFieldProps, "type" | "maxLength"> {
}
export {};
