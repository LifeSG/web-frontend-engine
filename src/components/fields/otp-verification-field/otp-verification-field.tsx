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
import { IOtpVerificationFieldSchema, TOtpVerificationState, TOtpVerificationType } from "./types";
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
	const [verifyError, setVerifyError] = useState<string | undefined>(undefined);
	const transactionIdRef = useRef<string | undefined>(undefined);

	const otpRule = validation?.find((rule) => "otp-type" in rule);
	const isRequiredRule = validation?.find((rule) => "required" in rule);
	const { setFieldValidationConfig } = useValidationConfig();
	const { formState, setError } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.object()
				.test(
					"is-phone-number-valid",
					otpRule?.errorMessage || ERROR_MESSAGES.CONTACT.INVALID_SINGAPORE_NUMBER,
					(val) => {
						if (otpRule?.["otp-type"] !== "phone-number") return true;
						return isValidPhoneNumber(val?.contact ?? "");
					}
				)
				.test("is-email-valid", otpRule?.errorMessage || ERROR_MESSAGES.EMAIL.INVALID, (val) => {
					if (otpRule?.["otp-type"] !== "email") return true;
					return isValidEmail(val?.contact ?? "");
				})
				.test(
					"is-otp-verified",
					isRequiredRule?.errorMessage || ERROR_MESSAGES.COMMON.FIELD_REQUIRED,
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
			setError(id, { type: "is-email-valid", message: otpRule?.errorMessage || ERROR_MESSAGES.EMAIL.INVALID });
			throw new Error();
		}

		if (otpValidationType === "phone-number" && !isValidPhoneNumber(phoneNo)) {
			setError(id, { type: "is-phone-number-valid", message: otpRule?.errorMessage || ERROR_MESSAGES.CONTACT.INVALID_SINGAPORE_NUMBER });
			throw new Error();
		}

		const sendBody: Record<string, unknown> = {
			type,
			...(type === "email" ? { email: emailValue } : { phoneNo }),
			...(sendOtpRequest.withPrefix !== undefined && { withPrefix: sendOtpRequest.withPrefix }),
		};

		const response = await new AxiosApiClient("", undefined, undefined, true)
			.post<Record<string, unknown>>(sendOtpRequest.url, sendBody, { headers: sendOtpRequest.headers })
			.catch(() => {
				const errorMsg = ERROR_MESSAGES.OTP_VERIFICATION.SEND_FAILED;
				setError(id, { message: errorMsg });
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
					otpPrefix,
					type,
					state: "sent",
				},
			},
		});
	};

	const handleVerifyOtp = async (otp: string): Promise<void> => {
		setVerifyError(undefined);

		const contact = type === "email" ? emailValue : `${phoneNumberValue.countryCode}${phoneNumberValue.number}`;

		const response = await new AxiosApiClient("", undefined, undefined, true)
			.post<Record<string, unknown>>(
				verifyOtpRequest.url,
				{
					transactionId: transactionIdRef.current,
					otp,
					otpPrefix,
				},
				{ headers: verifyOtpRequest.headers }
			)
			.catch(() => {
				const errorMsg = ERROR_MESSAGES.OTP_VERIFICATION.VERIFY_FAILED;
				setVerifyError(errorMsg);
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

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const getSendOtpError = (): string | undefined => {
		const isContactError = error?.type === "is-email-valid" || error?.type === "is-phone-number-valid";
		if (isContactError) return error?.message;

		const isOtpRequiredOnSubmit = formState.isSubmitted && error?.type === "is-otp-verified";
		if (isOtpRequiredOnSubmit) return error?.message;

		return undefined;
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
		verifyOtpError: verifyError,
		otpValue: { value: otpCode, ...(otpPrefix && { prefix: otpPrefix }) },
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
