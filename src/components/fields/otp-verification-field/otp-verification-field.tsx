import { LifeSGTheme } from "@lifesg/react-design-system";
import { Form } from "@lifesg/react-design-system/form";
import { PhoneNumberInputValue } from "@lifesg/react-design-system/phone-number-input";
import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "styled-components";
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
import { useFormContext } from "react-hook-form";

const isValidEmail = (contact: string) => Yup.string().email().isValidSync(contact);
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
			sendOtpRequest,
			verifyOtpRequest,
			verifyOtpCountdownTimer,
			disabled,
			readOnly,
			prefixSeparator,
			type,
			...otherSchema
		},
	} = props;

	const [otpState, setOtpState] = useState<TOtpVerificationState>("default");
	const [emailValue, setEmailValue] = useState<string>("");
	const [phoneNumberValue, setPhoneNumberValue] = useState<PhoneNumberInputValue>({
		number: "",
		countryCode: "+65",
	});
	const [otpCode, setOtpCode] = useState<string>("");
	const [otpPrefix, setOtpPrefix] = useState<string | undefined>(undefined);
	const transactionIdRef = useRef<string | undefined>(undefined);

	const otpRule = validation?.find((rule) => "otp-type" in rule);
	const isRequiredRule = validation?.find((rule) => "required" in rule);
	const { setFieldValidationConfig } = useValidationConfig();
	const { formState, setError, clearErrors } = useFormContext();

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
	}, [validation]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================

	const handleSendOtp = async (): Promise<void> => {
		const otpValidationType: TOtpVerificationType = otpRule?.["otp-type"] ?? undefined;

		const phoneNo = `${phoneNumberValue.countryCode}${phoneNumberValue.number}`;
		const contact = otpValidationType === "email" ? emailValue : phoneNo;

		if (otpValidationType === "email" && !isValidEmail(emailValue)) {
			setError(id, {
				type: EOtpVerificationErrorType.IS_EMAIL_VALID,
				message: otpRule?.errorMessage || ERROR_MESSAGES.OTP_VERIFICATION.INVALID_EMAIL,
			});
			throw new Error();
		}

		if (otpValidationType === "phone-number" && !isValidPhoneNumber(phoneNo)) {
			setError(id, {
				type: EOtpVerificationErrorType.IS_PHONE_NUMBER_VALID,
				message: otpRule?.errorMessage || ERROR_MESSAGES.OTP_VERIFICATION.INVALID_PHONE,
			});
			throw new Error();
		}

		const sendBody: Record<string, unknown> = {
			type,
			...(type === "email" ? { email: emailValue } : { phoneNo }),
			...(sendOtpRequest.withPrefix !== undefined && { withPrefix: sendOtpRequest.withPrefix }),
		};

		const response = await new AxiosApiClient("", undefined, undefined, true)
			.post<Record<string, unknown>>(sendOtpRequest.url, sendBody)
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

		onChange({
			target: {
				value: {
					contact,
					otpPrefix: prefix ?? otpPrefix,
					type,
					state: "sent",
				},
			},
		});
	};

	const handleVerifyOtp = async (otp: string): Promise<void> => {
		const contact = type === "email" ? emailValue : `${phoneNumberValue.countryCode}${phoneNumberValue.number}`;

		const response = await new AxiosApiClient("", undefined, undefined, true)
			.post<Record<string, unknown>>(verifyOtpRequest.url, {
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
		setEmailValue(input);
		clearErrors(id);
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
		setPhoneNumberValue(val);
		clearErrors(id);
		onChange({
			target: {
				value: {
					...value,
					contact: `${val.countryCode}${val.number}`,
				},
			},
		});
	};

	const handleOtpChange = (val: string): void => {
		setOtpCode(val);
	};

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
			error?.type === EOtpVerificationErrorType.IS_OTP_VERIFIED ||
			error?.type === EOtpVerificationErrorType.OTP_VERIFICATION_FAILED;
		if (isVerificationError) return error?.message;

		return;
	};

	const commonProps = {
		id,
		"data-testid": TestHelper.generateId(id, "otp-verification-field"),
		label: formattedLabel,
		disabled,
		readOnly,
		otpState,
		onOtpStateChange: setOtpState,
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
		...otherSchema,
	};

	return (
		<ThemeProvider theme={LifeSGTheme}>
			{type === "email" ? (
				<Form.OtpVerification
					{...commonProps}
					type="email"
					emailValue={emailValue}
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
		</ThemeProvider>
	);
};
