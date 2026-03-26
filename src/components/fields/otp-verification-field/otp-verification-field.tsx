import { Form } from "@lifesg/react-design-system/form";
import { PhoneNumberInputValue } from "@lifesg/react-design-system/phone-number-input";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { AxiosApiClient, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES } from "../../shared";
import { PhoneHelper } from "../contact-field/utils";
import { IGenericFieldProps } from "../types";
import {
	EOtpVerificationErrorType,
	IOtpVerificationFieldSchema,
	TOtpVerificationState,
	TOtpVerificationType,
} from "./types";

const isValidEmail = (contact: string) => Yup.string().required().email().isValidSync(contact);
const isValidPhoneNumber = (contact: string) => PhoneHelper.isSingaporeNumber(contact);

export const OtpVerificationField = (props: IGenericFieldProps<IOtpVerificationFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		id,
		value,
		formattedLabel,
		onChange,
		schema: {
			validation,
			request,
			verification,
			withPrefix,
			verifyOtpCountdownTimer,
			prefixSeparator,
			type,
			...otherSchema
		},
	} = props;

	const [otpCode, setOtpCode] = useState<string>(value?.otpCode || "");
	const [otpPrefix, setOtpPrefix] = useState<string | undefined>(value?.otpPrefix);
	const transactionIdRef = useRef<string | undefined>(value?.transactionId);
	const sentOtpAtSubmitCountRef = useRef<number>(-1);

	const otpState: TOtpVerificationState = value?.state || "default";

	const contactValue = value?.contact || "";
	const phoneNumberValue: PhoneNumberInputValue = {
		number: type === "phone-number" ? contactValue : "",
		countryCode: "+65",
	};

	const otpRule = validation?.find((rule) => "otp-type" in rule);
	const isRequiredRule = validation?.find((rule) => "required" in rule);
	const { setFieldValidationConfig } = useValidationConfig();
	const { formState, setError, clearErrors } = useFormContext();
	const { submitCount } = formState;

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.object().test(
				EOtpVerificationErrorType.IS_OTP_VERIFIED,
				isRequiredRule?.errorMessage || getOtpVerificationErr(),
				(val) => {
					if (!isRequiredRule?.required) return true;
					return val?.state === "verified";
				}
			),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, otpState]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================

	const handleSendOtp = async (): Promise<void> => {
		const otpValidationType: TOtpVerificationType = otpRule?.["otp-type"] ?? undefined;

		if (otpValidationType === "email" && !isValidEmail(contactValue)) {
			setError(id, {
				type: EOtpVerificationErrorType.IS_EMAIL_VALID,
				message: otpRule?.errorMessage || ERROR_MESSAGES.OTP_VERIFICATION.INVALID_EMAIL,
			});
			throw new Error();
		}

		const phoneNo = `${phoneNumberValue.countryCode}${phoneNumberValue.number}`;

		if (otpValidationType === "phone-number" && !isValidPhoneNumber(phoneNo)) {
			setError(id, {
				type: EOtpVerificationErrorType.IS_PHONE_NUMBER_VALID,
				message: otpRule?.errorMessage || ERROR_MESSAGES.OTP_VERIFICATION.INVALID_PHONE,
			});
			throw new Error();
		}

		const sendBody: Record<string, unknown> = {
			type,
			...(type === "email" ? { email: contactValue } : { phoneNo }),
			...(withPrefix !== undefined && { withPrefix }),
		};

		const response = await new AxiosApiClient("", undefined, undefined, true)
			.post<Record<string, unknown>>(request.endpoint.url, sendBody)
			.catch((error) => {
				const errorMsg = error?.message || ERROR_MESSAGES.OTP_VERIFICATION.SEND_OTP_FAILED;
				setError(id, { type: EOtpVerificationErrorType.SEND_OTP_FAILED, message: errorMsg });
				throw new Error(errorMsg);
			});

		const txId = (response?.transactionId ?? (response?.data as Record<string, unknown>)?.transactionId) as
			| string
			| undefined;
		const prefix = (response?.prefix ?? (response?.data as Record<string, unknown>)?.prefix) as string | undefined;

		transactionIdRef.current = txId;
		if (prefix) setOtpPrefix(prefix);

		clearErrors(id);
		sentOtpAtSubmitCountRef.current = submitCount;
		onChange({
			target: {
				value: {
					contact: otpValidationType === "email" ? contactValue : phoneNumberValue.number,
					otpPrefix: prefix ?? otpPrefix,
					type,
					state: "sent",
				},
			},
		});
	};

	const handleVerifyOtp = async (otp: string): Promise<void> => {
		const contact = type === "email" ? contactValue : phoneNumberValue.number;

		const response = await new AxiosApiClient("", undefined, undefined, true)
			.post<Record<string, unknown>>(verification.endpoint.url, {
				transactionId: transactionIdRef.current,
				otp,
				otpPrefix,
			})
			.catch((error) => {
				// base on status
				const errorMsg = error?.message || ERROR_MESSAGES.OTP_VERIFICATION.OTP_VERIFICATION_FAILED;
				setError(id, { type: EOtpVerificationErrorType.OTP_VERIFICATION_FAILED, message: errorMsg });
				throw new Error(errorMsg);
			});

		const additionalData = response?.additionalData ?? (response?.data as Record<string, unknown>)?.additionalData;

		onChange({
			target: {
				value: {
					contact,
					otpPrefix,
					type,
					state: "verified",
					additionalData,
				},
			},
		});
	};

	const handleEmailChange = (input: string): void => {
		onChange({
			target: {
				value: {
					...value,
					contact: input,
				},
			},
		});
	};

	const handlePhoneNumberChange = (val: PhoneNumberInputValue): void => {
		let finalContact = val.number;
		// if number is empty we should just pass an empty string so required validation can kick in natively if needed
		if (!val.number) {
			finalContact = "";
		}
		onChange({
			target: {
				value: {
					...value,
					contact: finalContact,
				},
			},
		});
	};

	const handleOtpChange = (val: string): void => {
		setOtpCode(val);
	};

	const handleOtpStateChange = (newState: TOtpVerificationState): void => {
		if (newState === "default") {
			setOtpCode("");
			setOtpPrefix(undefined);
			transactionIdRef.current = undefined;
			onChange({
				target: {
					value: {
						...value,
						state: undefined,
						additionalData: undefined,
						otpPrefix: undefined,
					},
				},
			});
		}
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getOtpVerificationErr = () => {
		if (otpState === "default") {
			if (type === "email") {
				return ERROR_MESSAGES.OTP_VERIFICATION.EMAIL_VERIFICATION_REQUIRED;
			} else {
				return ERROR_MESSAGES.OTP_VERIFICATION.PHONE_VERIFICATION_REQUIRED;
			}
		} else if (otpState === "sent") {
			return ERROR_MESSAGES.OTP_VERIFICATION.OTP_REQUIRED;
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const getSendOtpError = (): string | undefined => {
		if (otpState === "sent") return;

		const isSendError =
			error?.type === EOtpVerificationErrorType.IS_EMAIL_VALID ||
			error?.type === EOtpVerificationErrorType.IS_PHONE_NUMBER_VALID ||
			error?.type === EOtpVerificationErrorType.SEND_OTP_FAILED;
		if (isSendError) return error?.message;

		const isOtpRequiredOnSubmit =
			formState.isSubmitted && error?.type === EOtpVerificationErrorType.IS_OTP_VERIFIED;
		if (isOtpRequiredOnSubmit) return error?.message;

		return;
	};

	const getVerifyOtpError = (): string | undefined => {
		if (otpState !== "sent") return;

		const isVerificationError =
			(error?.type === EOtpVerificationErrorType.IS_OTP_VERIFIED &&
				submitCount > sentOtpAtSubmitCountRef.current) ||
			error?.type === EOtpVerificationErrorType.OTP_VERIFICATION_FAILED ||
			error?.type === EOtpVerificationErrorType.API_ERROR;
		if (isVerificationError) return error?.message;

		return;
	};

	const commonProps = {
		id,
		"data-testid": TestHelper.generateId(id, "otp-verification-field"),
		label: formattedLabel,
		otpState,
		onOtpStateChange: handleOtpStateChange,
		onSendOtp: handleSendOtp,
		onResendOtp: handleSendOtp,
		onVerifyOtp: handleVerifyOtp,
		sendOtpError: getSendOtpError(),
		verifyOtpError: getVerifyOtpError(),
		otpValue: {
			value: otpCode,
			...(otpPrefix && { prefix: otpPrefix }),
			...(prefixSeparator && { prefixSeparator }),
		},
		onOtpChange: handleOtpChange,
		...(verifyOtpCountdownTimer !== undefined && { verifyOtpCountdownTimer }),
		...(verification.showThumbnail !== undefined && { showVerifyOtpThumbnail: verification.showThumbnail }),
		...(verification.title !== undefined && { verifyOtpTitle: verification.title }),
		...(verification.message !== undefined && { verifyOtpMessage: verification.message }),
		...otherSchema,
	};

	return (
		<>
			{type === "email" ? (
				<Form.OtpVerification
					{...commonProps}
					type="email"
					emailValue={contactValue}
					onEmailChange={handleEmailChange}
				/>
			) : (
				<Form.OtpVerification
					{...commonProps}
					type="phone-number"
					phoneNumberValue={phoneNumberValue}
					onPhoneNumberChange={handlePhoneNumberChange}
					fixedCountry={true}
				/>
			)}
		</>
	);
};
