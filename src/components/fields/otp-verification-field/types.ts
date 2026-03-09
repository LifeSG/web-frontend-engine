import { AxiosRequestConfig } from "axios";
import { IYupValidationRule } from "../../types";
import { IBaseFieldSchema } from "../types";

export type TOtpVerificationType = "phone-number" | "email";

export type TOtpVerificationState = "default" | "sent" | "verified";

export interface IOtpVerificationFieldValidationRule extends IYupValidationRule {
	"otp-type"?: TOtpVerificationType | undefined;
}

export interface IOtpVerificationFieldApiRequest {
	url: string;
	headers?: AxiosRequestConfig["headers"] | undefined;
	/** Whether the backend should generate a prefix for the OTP. Sent in the request body to the backend service. */
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
