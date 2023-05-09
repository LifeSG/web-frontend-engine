import { IFrontendEngineBaseFieldJsonSchema, TComponentOmitProps } from "../../frontend-engine/types";
import { CountryData } from "./data";
import { PhoneNumberInputProps } from "@lifesg/react-design-system";

interface IContactFieldProps extends PhoneNumberInputProps {
	country?: TCountry;
	enableSearch?: boolean | undefined;
}

export type TSingaporeNumberRule = "default" | "house" | "mobile";

export type TCountry = (typeof CountryData)[number][0];

export type TCallingCodeMap = Map<TCountry, string>;

export interface IContactFieldValidationRule {
	contactNumber?:
		| {
				internationalNumber: boolean | Omit<TCountry, "Singapore">;
				singaporeNumber?: never;
		  }
		| {
				internationalNumber?: never;
				singaporeNumber: TSingaporeNumberRule;
		  };
}

export interface ISelectedCountry {
	prefix: string | undefined;
	name: TCountry;
}

export interface IParsedPhoneNumber {
	prefix: string;
	number: string;
}

export interface IContactFieldSchema<V = undefined>
	extends IFrontendEngineBaseFieldJsonSchema<"contact-field", V, IContactFieldValidationRule>,
		TComponentOmitProps<IContactFieldProps> {}
