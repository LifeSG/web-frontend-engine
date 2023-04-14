import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";
import { InternationalCallingCodeMap } from "./data";
export type TCountry = keyof typeof InternationalCallingCodeMap;
interface IContactFieldProps extends FormInputProps {
    country?: TCountry;
    enableSearch?: boolean | undefined;
}
export type TSingaporeNumberRule = "default" | "house" | "mobile";
export interface IContactFieldValidationRule {
    contactNumber?: {
        internationalNumber: true;
        singaporeNumber?: never;
    } | {
        internationalNumber?: never;
        singaporeNumber: TSingaporeNumberRule;
    };
}
export interface ISelectedCountry {
    prefix: string;
    name: TCountry;
}
export interface IParsedPhoneNumber {
    prefix: string;
    number: string;
}
export interface IContactFieldSchema<V = undefined> extends IFrontendEngineBaseFieldJsonSchema<"contact-field", V, IContactFieldValidationRule>, TComponentOmitProps<IContactFieldProps> {
}
export {};
