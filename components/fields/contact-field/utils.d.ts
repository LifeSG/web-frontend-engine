import { IParsedPhoneNumber } from "./types";
export declare namespace PhoneHelper {
    const getParsedPhoneNumber: (value: string) => IParsedPhoneNumber;
    const isSingaporeNumber: (value: string, validateHomeNumber?: boolean) => boolean;
    const isInternationalNumber: (country: string, value: string) => boolean;
    const formatPhoneNumber: (prefix: string, value: string) => string | undefined;
}
