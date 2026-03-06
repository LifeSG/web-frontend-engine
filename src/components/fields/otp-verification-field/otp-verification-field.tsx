import { Form } from "@lifesg/react-design-system/form";
import { PhoneNumberInputValue } from "@lifesg/react-design-system/phone-number-input";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { AxiosApiClient, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES } from "../../shared";
import { IGenericFieldProps } from "../types";
import {
	IOtpVerificationFieldSchema,
	IOtpVerificationFieldValidationRule,
	IOtpVerificationValue,
	TOtpVerificationState,
	TOtpVerificationType,
} from "./types";

export const OtpVerificationField = (props: IGenericFieldProps<IOtpVerificationFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		id,
		formattedLabel,
		onChange,
		value,
		schema: {
			label: _label,
			uiType: _uiType,
			validation,
			sendOtpRequest,
			verifyOtpRequest,
			verifyOtpCountdownTimer,
			disabled,
			readOnly,
			...otherSchema
		},
	} = props;

	const [otpType, setOtpType] = useState<TOtpVerificationType>("phone-number");
	const [otpState, setOtpState] = useState<TOtpVerificationState>("default");
	const [emailValue, setEmailValue] = useState<string>("");
	const [phoneNumberValue, setPhoneNumberValue] = useState<PhoneNumberInputValue>({
		number: "",
		countryCode: "+65",
	});
	const [otpCode, setOtpCode] = useState<string>("");
	const [otpPrefix, setOtpPrefix] = useState<string | undefined>(undefined);
	const [sendError, setSendError] = useState<string | undefined>(undefined);
	const [verifyError, setVerifyError] = useState<string | undefined>(undefined);
	const transactionIdRef = useRef<string | undefined>(undefined);
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const otpTypeRule = validation?.find((rule): rule is IOtpVerificationFieldValidationRule => "otp-type" in rule);
		const type: TOtpVerificationType = otpTypeRule?.["otp-type"] ?? "phone-number";
		setOtpType(type);

		setFieldValidationConfig(
			id,
			Yup.object()
				.test("otp-verified", ERROR_MESSAGES.OTP_VERIFICATION.MUST_BE_VERIFIED, (val) => {
					if (!val) return true;
					return val.state === "verified";
				})
				.default(undefined),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		if (!value) {
			setOtpState("default");
			setOtpCode("");
			setOtpPrefix(undefined);
			setSendError(undefined);
			setVerifyError(undefined);
			transactionIdRef.current = undefined;
		}
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleOtpStateChange = (state: TOtpVerificationState): void => {
		setOtpState(state);
		if (state === "default") {
			setSendError(undefined);
			setVerifyError(undefined);
			setOtpCode("");
			setOtpPrefix(undefined);
			transactionIdRef.current = undefined;
			onChange({ target: { value: undefined } });
		}
	};

	const handleSendOtp = async (): Promise<void> => {
		setSendError(undefined);
		const phoneNo = `${phoneNumberValue.countryCode}${phoneNumberValue.number}`;
		const contact = otpType === "email" ? emailValue : phoneNo;

		const sendBody: Record<string, unknown> = {
			type: otpType,
			...(otpType === "email" ? { email: emailValue } : { phoneNo }),
			...(sendOtpRequest.withPrefix !== undefined && { withPrefix: sendOtpRequest.withPrefix }),
		};

		const response = await new AxiosApiClient("", undefined, undefined, true)
			.post<Record<string, unknown>>(sendOtpRequest.url, sendBody, { headers: sendOtpRequest.headers })
			.catch(() => {
				const errorMsg = ERROR_MESSAGES.OTP_VERIFICATION.SEND_FAILED;
				setSendError(errorMsg);
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
					...(prefix && { prefix }),
					type: otpType,
					state: "sent",
				} as IOtpVerificationValue,
			},
		});
	};

	const handleVerifyOtp = async (otp: string): Promise<void> => {
		setVerifyError(undefined);
		const contact = otpType === "email" ? emailValue : `${phoneNumberValue.countryCode}${phoneNumberValue.number}`;

		const response = await new AxiosApiClient("", undefined, undefined, true)
			.post<Record<string, unknown>>(
				verifyOtpRequest.url,
				{
					transactionId: transactionIdRef.current,
					otp,
					...(otpPrefix && { prefix: otpPrefix }),
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
					...(otpPrefix && { prefix: otpPrefix }),
					type: otpType,
					state: "verified",
					...(additionalData !== undefined && { additionalData }),
				} as IOtpVerificationValue,
			},
		});
	};

	const handleEmailChange = (input: string): void => {
		setEmailValue(input);
	};

	const handlePhoneNumberChange = (val: PhoneNumberInputValue): void => {
		setPhoneNumberValue(val);
	};

	const handleOtpChange = (val: string): void => {
		setOtpCode(val);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const commonProps = {
		id,
		"data-testid": TestHelper.generateId(id, "otp-verification-field"),
		label: formattedLabel,
		disabled,
		readOnly,
		otpState,
		onOtpStateChange: handleOtpStateChange,
		onSendOtp: handleSendOtp,
		onResendOtp: handleSendOtp,
		onVerifyOtp: handleVerifyOtp,
		sendOtpError: error?.message || sendError,
		verifyOtpError: verifyError,
		otpValue: { value: otpCode, ...(otpPrefix && { prefix: otpPrefix }) },
		onOtpChange: handleOtpChange,
		...(verifyOtpCountdownTimer !== undefined && { verifyOtpCountdownTimer }),
		...otherSchema,
	};

	return (
		<>
			{otpType === "email" ? (
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
		</>
	);
};
