import { IYupValidationRule } from "../../types";
import { IBaseFieldSchema } from "../types";

export type TOtpVerificationType = "phone-number" | "email";

export enum EOtpVerificationErrorType {
	IS_EMAIL_VALID = "is-email-valid",
	IS_PHONE_NUMBER_VALID = "is-phone-number-valid",
	SEND_OTP_FAILED = "send-otp-failed",
	OTP_VERIFICATION_FAILED = "otp-verification-failed",
	IS_OTP_VERIFIED = "is-otp-verified",
	API_ERROR = "api",
}

export type TOtpVerificationState = "default" | "sent" | "verified";

export interface IOtpVerificationFieldValidationRule extends IYupValidationRule {
	"otp-type"?: TOtpVerificationType | undefined;
}

export interface IOtpVerificationFieldApiRequest {
	url: string;
	withPrefix?: boolean | undefined;
}

export interface IOtpVerificationFieldSchema<V = undefined>
	extends IBaseFieldSchema<"otp-verification-field", V, IOtpVerificationFieldValidationRule> {
	sendOtpRequest: IOtpVerificationFieldApiRequest;
	verifyOtpRequest: IOtpVerificationFieldApiRequest;
	type: TOtpVerificationType;
	disabled?: boolean | undefined;
	readOnly?: boolean | undefined;
	className?: string | undefined;
	prefixSeparator?: string | undefined;
	verifyOtpCountdownTimer?: number | undefined;
	sendOtpPlaceholder?: string | undefined;
	showVerifyOtpThumbnail?: boolean | undefined;
	verifyOtpTitle?: string | undefined;
	verifyOtpMessage?: string | undefined;
}

export interface IOtpVerificationValue {
	contact: string;
	prefix?: string | undefined;
	type: TOtpVerificationType;
	state: "sent" | "verified";
	additionalData?: unknown;
}
