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

export interface IOtpVerificationFieldEndpoint {
	url: string;
}

export interface IOtpVerificationFieldRequest {
	endpoint: IOtpVerificationFieldEndpoint;
	placeholder?: string | undefined;
}

export interface IOtpVerificationFieldVerification {
	endpoint: IOtpVerificationFieldEndpoint;
	showThumbnail?: boolean | undefined;
	title?: string | undefined;
	message?: string | undefined;
}

export interface IOtpVerificationFieldSchema<V = undefined>
	extends IBaseFieldSchema<"otp-verification-field", V, IOtpVerificationFieldValidationRule> {
	request: IOtpVerificationFieldRequest;
	verification: IOtpVerificationFieldVerification;
	type: TOtpVerificationType;
	withPrefix?: boolean | undefined;
	disabled?: boolean | undefined;
	readOnly?: boolean | undefined;
	className?: string | undefined;
	prefixSeparator?: string | undefined;
	verifyOtpCountdownTimer?: number | undefined;
}

export interface IOtpVerificationValue {
	contact: string;
	prefix?: string | undefined;
	type: TOtpVerificationType;
	state: "sent" | "verified";
	additionalData?: unknown;
}
