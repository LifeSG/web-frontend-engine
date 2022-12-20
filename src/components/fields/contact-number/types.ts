import { FormInputGroupProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineFieldJsonSchema, TComponentNativeProps } from "../../frontend-engine/types";
import { IYupValidationRule } from "../../frontend-engine/yup/types";
import { InternationalCallingCodeMap } from "./data";

export type TCountry = keyof typeof InternationalCallingCodeMap;

interface IContactNumberProps extends FormInputGroupProps<string, unknown> {
	country?: TCountry;
	enableSearch?: boolean | undefined;
}

export type TSingaporeNumberRule = "default" | "house" | "mobile";

interface IContactNumberValidationRules extends IYupValidationRule {
	contactNumber?:
		| {
				internationalNumber: true;
				singaporeNumber?: never;
		  }
		| {
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

export interface IContactNumberSchema
	extends IFrontendEngineFieldJsonSchema<"contact", IContactNumberValidationRules>,
		TComponentNativeProps<IContactNumberProps> {}
