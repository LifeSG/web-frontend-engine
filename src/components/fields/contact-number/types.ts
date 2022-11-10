import { FormInputGroupProps } from "@lifesg/react-design-system/form/types";
import {
	IFrontendEngineBaseFieldJsonSchema,
	TFrontendEngineBaseFieldJsonSchemaKeys,
} from "../../frontend-engine/types";
import { IYupValidationRule } from "../../frontend-engine/yup/types";
import { InternationalCallingCodeMap } from "./data";

export type TCountry = keyof typeof InternationalCallingCodeMap;

interface IContactNumberProps extends FormInputGroupProps<string, unknown> {
	country?: TCountry;
	allowInternationalNumbers?: boolean;
	enableSearch?: boolean;
}

export interface ISingaporeNumberValidationRule {
	singaporeNumber?:
		| boolean
		| {
				homeNumber: true;
				mobileNumber?: boolean;
		  }
		| {
				mobileNumber: true;
				homeNumber?: boolean;
		  };
}

interface IContactNumberValidationRules extends ISingaporeNumberValidationRule, IYupValidationRule {
	internationalNumber?: boolean;
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
	extends IFrontendEngineBaseFieldJsonSchema<"contact", IContactNumberValidationRules>,
		Omit<IContactNumberProps, TFrontendEngineBaseFieldJsonSchemaKeys> {}
