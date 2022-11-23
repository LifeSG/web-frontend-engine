import { FormInputProps } from "@lifesg/react-design-system/form/types";
import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";
import { IYupValidationRule } from "../../frontend-engine/yup/types";
import { InternationalCallingCodeMap } from "./data";

export type TCountry = keyof typeof InternationalCallingCodeMap;

interface IContactNumberProps extends FormInputProps {
	country?: TCountry;
	enableSearch?: boolean | undefined;
}

export type TSingaporeNumberRule = "default" | "house" | "mobile";

export interface IContactNumberValidationRules extends IYupValidationRule {
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

export interface IContactNumberSchema<V = IContactNumberValidationRules>
	extends IFrontendEngineBaseFieldJsonSchema<"contact", V>,
		TComponentOmitProps<IContactNumberProps> {}
