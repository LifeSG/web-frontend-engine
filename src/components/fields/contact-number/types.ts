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

interface IContactNumberValidationRules extends IYupValidationRule {
	isSingaporeNumber?: {
		isHomeNumber?: boolean;
		isMobileNumber?: boolean;
	};
	isInternationalNumber?: boolean;
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
