import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import { IOtpVerificationFieldSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { AxiosApiClient } from "../../../../utils";
import {
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "otp-verification-field";
const COMPONENT_LABEL = "OTP Verification";
const SEND_OTP_URL = "https://api.example.com/send-otp";
const VERIFY_OTP_URL = "https://api.example.com/verify-otp";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: COMPONENT_LABEL,
					uiType: UI_TYPE,
					type: "phone-number",
					sendOtpRequest: { url: SEND_OTP_URL },
					verifyOtpRequest: { url: VERIFY_OTP_URL },
					validation: [{ "otp-type": "phone-number" }, { required: true }],
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (
	overrideField?: TOverrideField<IOtpVerificationFieldSchema>,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = merge(cloneDeep(JSON_SCHEMA), overrideSchema);
	merge(json, {
		sections: {
			section: {
				children: {
					[COMPONENT_ID]: overrideField,
				},
			},
		},
	});
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getSendOtpButton = () => screen.getByTestId("field__otp-verification-field-base-contact-contact-button");
const getVerifyOtpButton = () => screen.getByTestId("field__otp-verification-field-base-verification-verify-button");
const getComponent = () => screen.getByLabelText(COMPONENT_LABEL);

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the phone-number OTP field", () => {
		renderComponent();
		expect(getComponent()).toBeInTheDocument();
	});

	it("should be able to render the email OTP field", () => {
		renderComponent({ type: "email", validation: [{ "otp-type": "email" }] });
		expect(getComponent()).toBeInTheDocument();
	});

	fit("should call the send OTP API with the contact number when send OTP button is clicked", async () => {
		const postSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ transactionId: "txn-123" });

		renderComponent();
		fireEvent.change(getComponent(), {
			target: { value: { contact: "81234567", state: "default" } },
		});

		fireEvent.click(getSendOtpButton());

		await waitFor(() => {
			expect(postSpy).toHaveBeenCalledWith(
				SEND_OTP_URL,
				expect.objectContaining({ type: "phone-number", phoneNo: expect.any(String) }),
				expect.anything()
			);
		});
	});

	// it("should show send OTP error on API failure", async () => {
	// 	jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue(new Error());

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => {
	// 		expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.SEND_OTP_FAILED)).toBeInTheDocument();
	// 	});
	// });

	// it("should transition to sent state and show OTP input after successful send", async () => {
	// 	jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ transactionId: "txn-123" });

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => {
	// 		expect(getVerifyOtpButton()).toBeInTheDocument();
	// 	});
	// });

	// it("should call the verify OTP API with the transaction ID and OTP on verify", async () => {
	// 	const postSpy = jest
	// 		.spyOn(AxiosApiClient.prototype, "post")
	// 		.mockResolvedValueOnce({ transactionId: "txn-abc" })
	// 		.mockResolvedValueOnce({ additionalData: { userId: "u1" } });

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());

	// 	fireEvent.click(getVerifyOtpButton());

	// 	await waitFor(() => {
	// 		expect(postSpy).toHaveBeenNthCalledWith(
	// 			2,
	// 			VERIFY_OTP_URL,
	// 			expect.objectContaining({ transactionId: "txn-abc" }),
	// 			expect.anything()
	// 		);
	// 	});
	// });

	// it("should show verify OTP error on API failure", async () => {
	// 	jest.spyOn(AxiosApiClient.prototype, "post")
	// 		.mockResolvedValueOnce({ transactionId: "txn-123" })
	// 		.mockRejectedValueOnce(new Error());

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());

	// 	fireEvent.click(getVerifyOtpButton());

	// 	await waitFor(() => {
	// 		expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.OTP_VERIFICATION_FAILED)).toBeInTheDocument();
	// 	});
	// });

	// it("should submit verified value with correct shape", async () => {
	// 	jest.spyOn(AxiosApiClient.prototype, "post")
	// 		.mockResolvedValueOnce({ transactionId: "txn-123" })
	// 		.mockResolvedValueOnce({ additionalData: { token: "abc" } });

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());

	// 	fireEvent.click(getVerifyOtpButton());

	// 	await waitFor(() => fireEvent.click(getSubmitButton()));

	// 	await waitFor(() => {
	// 		expect(SUBMIT_FN).toHaveBeenCalledWith(
	// 			expect.objectContaining({
	// 				[COMPONENT_ID]: expect.objectContaining({
	// 					type: "phone-number",
	// 					state: "verified",
	// 					additionalData: { token: "abc" },
	// 				}),
	// 			}),
	// 			expect.anything()
	// 		);
	// 	});
	// });

	// it("should support required validation - reject submission and show PHONE_VERIFICATION_REQUIRED when not verified", async () => {
	// 	renderComponent();

	// 	await waitFor(() => fireEvent.click(getSubmitButton()));

	// 	await waitFor(() => {
	// 		expect(
	// 			screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.PHONE_VERIFICATION_REQUIRED)
	// 		).toBeInTheDocument();
	// 	});
	// 	expect(SUBMIT_FN).not.toHaveBeenCalled();
	// });

	// it("should show EMAIL_VERIFICATION_REQUIRED when email type is not verified on submit", async () => {
	// 	renderComponent({
	// 		type: "email",
	// 		validation: [{ "otp-type": "email" }, { required: true }],
	// 	});

	// 	await waitFor(() => fireEvent.click(getSubmitButton()));

	// 	await waitFor(() => {
	// 		expect(
	// 			screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.EMAIL_VERIFICATION_REQUIRED)
	// 		).toBeInTheDocument();
	// 	});
	// 	expect(SUBMIT_FN).not.toHaveBeenCalled();
	// });

	// it("should allow submission without verification when not required", async () => {
	// 	renderComponent({ validation: [{ "otp-type": "phone-number" }] });

	// 	await waitFor(() => fireEvent.click(getSubmitButton()));

	// 	await waitFor(() => {
	// 		expect(SUBMIT_FN).toHaveBeenCalled();
	// 	});
	// });

	// it("should show OTP_REQUIRED error when only send OTP was completed but not verify", async () => {
	// 	jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ transactionId: "txn-123" });

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());

	// 	await waitFor(() => fireEvent.click(getSubmitButton()));

	// 	await waitFor(() => {
	// 		expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.OTP_REQUIRED)).toBeInTheDocument();
	// 	});
	// 	expect(SUBMIT_FN).not.toHaveBeenCalled();
	// });

	// it("should reset correctly when reset button is clicked", async () => {
	// 	jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ transactionId: "txn-123" });

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());

	// 	fireEvent.click(getResetButton());

	// 	await waitFor(() => {
	// 		expect(getSendOtpButton()).toBeInTheDocument();
	// 	});
	// });

	// it("should store prefix from send OTP response in the value", async () => {
	// 	jest.spyOn(AxiosApiClient.prototype, "post")
	// 		.mockResolvedValueOnce({ transactionId: "txn-123", prefix: "SG" })
	// 		.mockResolvedValueOnce({});

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());

	// 	fireEvent.click(getVerifyOtpButton());

	// 	await waitFor(() => fireEvent.click(getSubmitButton()));

	// 	await waitFor(() => {
	// 		expect(SUBMIT_FN).toHaveBeenCalledWith(
	// 			expect.objectContaining({
	// 				[COMPONENT_ID]: expect.objectContaining({
	// 					otpPrefix: "SG",
	// 					type: "phone-number",
	// 					state: "verified",
	// 				}),
	// 			}),
	// 			expect.anything()
	// 		);
	// 	});
	// });

	// it("should extract transactionId from data.transactionId response shape", async () => {
	// 	const postSpy = jest
	// 		.spyOn(AxiosApiClient.prototype, "post")
	// 		.mockResolvedValueOnce({ data: { transactionId: "nested-txn" } })
	// 		.mockResolvedValueOnce({});

	// 	renderComponent();
	// 	fireEvent.click(getSendOtpButton());

	// 	await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());

	// 	fireEvent.click(getVerifyOtpButton());

	// 	await waitFor(() => {
	// 		expect(postSpy).toHaveBeenNthCalledWith(
	// 			2,
	// 			VERIFY_OTP_URL,
	// 			expect.objectContaining({ transactionId: "nested-txn" }),
	// 			expect.anything()
	// 		);
	// 	});
	// });

	// it("should be disabled when disabled prop is set", () => {
	// 	renderComponent({ disabled: true });
	// 	expect(getSendOtpButton()).toBeDisabled();
	// });
});
