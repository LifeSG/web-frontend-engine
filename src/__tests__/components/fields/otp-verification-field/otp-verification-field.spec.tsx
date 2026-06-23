import "@testing-library/jest-dom";
import { fireEvent, render as rtlRender, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IOtpVerificationFieldSchema, IOtpVerificationValue } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { AxiosApiClient } from "../../../../utils";
import {
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "otp-verification-field";
const COMPONENT_LABEL = "OTP Verification";
const SEND_OTP_URL = "https://api.example.com/send-otp";
const VERIFY_OTP_URL = "https://api.example.com/verify-otp";
const MOCK_VALID_PHONE_NO = "86754231";
const MOCK_VALID_EMAIL = "test@example.com";
const MOCK_TXN_ID = "txn-123";
const MOCK_OTP = "123456";

const BASE_FIELD = {
	label: COMPONENT_LABEL,
	uiType: UI_TYPE,
	request: { endpoint: { url: SEND_OTP_URL } },
	verification: { endpoint: { url: VERIFY_OTP_URL } },
};

const buildSchema = (fieldOverrides: Partial<IOtpVerificationFieldSchema>): IFrontendEngineData => ({
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: { ...BASE_FIELD, ...fieldOverrides } as IOtpVerificationFieldSchema,
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
});

const renderComponent = (
	baseSchema: IFrontendEngineData,
	overrideField?: TOverrideField<IOtpVerificationFieldSchema>,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = merge(cloneDeep(baseSchema), overrideSchema);
	merge(json, {
		sections: { section: { children: { [COMPONENT_ID]: overrideField } } },
	});
	return rtlRender(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getPhoneNoInput = () => screen.getByPlaceholderText(/Enter.*mobile number/i);
const getEmailInput = () => getField("textbox", /Enter.*email address/);
const getOtpInput = () => screen.getByPlaceholderText("Enter OTP");
const getSendOtpButton = () => getField("button", { name: "Send OTP" });
const getVerifyOtpButton = () => getField("button", { name: "Verify" });

const VERIFIED_PHONE_DEFAULT_VALUE: IOtpVerificationValue = {
	contact: MOCK_VALID_PHONE_NO,
	type: "phone-number",
	state: "verified",
	additionalData: { token: "saved-token" },
};

const VERIFIED_EMAIL_DEFAULT_VALUE: IOtpVerificationValue = {
	contact: MOCK_VALID_EMAIL,
	type: "email",
	state: "verified",
	additionalData: { token: "saved-token" },
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("phone-number", () => {
		const PHONE_SCHEMA = buildSchema({
			type: "phone-number",
			validation: [{ "otp-type": "phone-number" }, { required: true }],
		});
		const PHONE_OPTIONAL_SCHEMA = buildSchema({
			type: "phone-number",
			validation: [{ "otp-type": "phone-number" }],
		});
		const render = (
			overrideField?: TOverrideField<IOtpVerificationFieldSchema>,
			overrideSchema?: TOverrideSchema
		) => renderComponent(PHONE_SCHEMA, overrideField, overrideSchema);

		it("should render the phone number input", () => {
			render();
			expect(getPhoneNoInput()).toBeInTheDocument();
		});

		it("should call the send OTP API with the phone number", async () => {
			const postSpy = jest
				.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValue({ transactionId: MOCK_TXN_ID });

			render();
			fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => {
				expect(postSpy).toHaveBeenCalledWith(SEND_OTP_URL, {
					type: "phone-number",
					phoneNo: `+65${MOCK_VALID_PHONE_NO}`,
				});
			});
		});

		it("should show send OTP error on API failure", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue(new Error());

			render();
			fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => {
				expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.SEND_OTP_FAILED)).toBeInTheDocument();
			});
		});

		it("should transition to sent state and show OTP input after successful send", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ transactionId: MOCK_TXN_ID });

			render();
			fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => {
				expect(getVerifyOtpButton()).toBeInTheDocument();
			});
		});

		it("should call the verify OTP API with the transaction ID and OTP", async () => {
			const postSpy = jest
				.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValueOnce({ transactionId: MOCK_TXN_ID })
				.mockResolvedValueOnce({ additionalData: { token: "mock-token" } });

			render();
			fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());
			fireEvent.change(getOtpInput(), { target: { value: MOCK_OTP } });
			fireEvent.click(getVerifyOtpButton());

			await waitFor(() => {
				expect(postSpy).toHaveBeenNthCalledWith(
					2,
					VERIFY_OTP_URL,
					expect.objectContaining({ otp: MOCK_OTP, transactionId: MOCK_TXN_ID })
				);
			});
		});

		it("should show verify OTP error on API failure", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValueOnce({ transactionId: MOCK_TXN_ID })
				.mockRejectedValueOnce(new Error());

			render();
			fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());
			fireEvent.change(getOtpInput(), { target: { value: MOCK_OTP } });
			fireEvent.click(getVerifyOtpButton());

			await waitFor(() => {
				expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.OTP_VERIFICATION_FAILED)).toBeInTheDocument();
			});
		});

		it("should submit verified value with correct shape", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValueOnce({ transactionId: MOCK_TXN_ID })
				.mockResolvedValueOnce({ additionalData: { token: "mock-token" } });

			render();
			fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());
			fireEvent.change(getOtpInput(), { target: { value: MOCK_OTP } });
			fireEvent.click(getVerifyOtpButton());

			await waitFor(() => expect(screen.queryByRole("button", { name: "Verify" })).not.toBeInTheDocument());
			fireEvent.click(getSubmitButton());

			await waitFor(() => {
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						[COMPONENT_ID]: expect.objectContaining({
							type: "phone-number",
							state: "verified",
							additionalData: { token: "mock-token" },
						}),
					})
				);
			});
		});

		it("should show PHONE_VERIFICATION_REQUIRED on submit when not verified", async () => {
			render();

			await waitFor(() => fireEvent.click(getSubmitButton()));

			await waitFor(() => {
				expect(
					screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.PHONE_VERIFICATION_REQUIRED)
				).toBeInTheDocument();
			});
			expect(SUBMIT_FN).not.toHaveBeenCalled();
		});

		it("should show OTP_REQUIRED on submit when OTP was sent but not verified", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ transactionId: MOCK_TXN_ID });

			render();
			fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			await waitFor(() => {
				expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.OTP_REQUIRED)).toBeInTheDocument();
			});
			expect(SUBMIT_FN).not.toHaveBeenCalled();
		});

		describe("defaultValues", () => {
			it("should support default verified phone OTP value", async () => {
				render(undefined, { defaultValues: { [COMPONENT_ID]: VERIFIED_PHONE_DEFAULT_VALUE } });

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: VERIFIED_PHONE_DEFAULT_VALUE })
				);
			});
		});

		describe("reset", () => {
			it("should clear phone OTP value on reset", async () => {
				renderComponent(PHONE_OPTIONAL_SCHEMA);

				fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
				fireEvent.click(getResetButton());
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(getPhoneNoInput()).toHaveValue("");
				expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
			});

			it("should revert to default verified phone OTP value on reset", async () => {
				render(undefined, { defaultValues: { [COMPONENT_ID]: VERIFIED_PHONE_DEFAULT_VALUE } });

				fireEvent.change(getPhoneNoInput(), { target: { value: "98765432" } });
				fireEvent.click(getResetButton());
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: VERIFIED_PHONE_DEFAULT_VALUE })
				);
			});
		});

		describe("dirty state", () => {
			let formIsDirty: boolean;
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				formIsDirty = ref.current.isDirty;
			};

			beforeEach(() => {
				formIsDirty = undefined;
			});

			it("should mount without setting field state as dirty", () => {
				rtlRender(<FrontendEngineWithCustomButton data={PHONE_SCHEMA} onClick={handleClick} />);
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(false);
			});

			it("should set form state as dirty if user modifies the phone OTP field", () => {
				rtlRender(<FrontendEngineWithCustomButton data={PHONE_SCHEMA} onClick={handleClick} />);
				fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(true);
			});

			it("should support default verified value without setting form state as dirty", () => {
				rtlRender(
					<FrontendEngineWithCustomButton
						data={{ ...PHONE_SCHEMA, defaultValues: { [COMPONENT_ID]: VERIFIED_PHONE_DEFAULT_VALUE } }}
						onClick={handleClick}
					/>
				);
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(false);
			});

			it("should reset and revert phone OTP form dirty state to false", () => {
				rtlRender(<FrontendEngineWithCustomButton data={PHONE_SCHEMA} onClick={handleClick} />);
				fireEvent.change(getPhoneNoInput(), { target: { value: MOCK_VALID_PHONE_NO } });
				fireEvent.click(getResetButton());
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(false);
			});

			it("should reset to default verified value without setting form state as dirty", () => {
				rtlRender(
					<FrontendEngineWithCustomButton
						data={{ ...PHONE_SCHEMA, defaultValues: { [COMPONENT_ID]: VERIFIED_PHONE_DEFAULT_VALUE } }}
						onClick={handleClick}
					/>
				);
				fireEvent.change(getPhoneNoInput(), { target: { value: "98765432" } });
				fireEvent.click(getResetButton());
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(false);
			});
		});
	});

	describe("email", () => {
		const EMAIL_SCHEMA = buildSchema({
			type: "email",
			validation: [{ "otp-type": "email" }, { required: true }],
		});
		const EMAIL_OPTIONAL_SCHEMA = buildSchema({
			type: "email",
			validation: [{ "otp-type": "email" }],
		});
		const render = (
			overrideField?: TOverrideField<IOtpVerificationFieldSchema>,
			overrideSchema?: TOverrideSchema
		) => renderComponent(EMAIL_SCHEMA, overrideField, overrideSchema);

		it("should render the email input", () => {
			render();
			expect(getEmailInput()).toBeInTheDocument();
		});

		it("should call the send OTP API with the email", async () => {
			const postSpy = jest
				.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValue({ transactionId: MOCK_TXN_ID });

			render();
			fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => {
				expect(postSpy).toHaveBeenCalledWith(SEND_OTP_URL, {
					type: "email",
					email: MOCK_VALID_EMAIL,
				});
			});
		});

		it("should show send OTP error on API failure", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue(new Error());

			render();
			fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => {
				expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.SEND_OTP_FAILED)).toBeInTheDocument();
			});
		});

		it("should transition to sent state and show OTP input after successful send", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ transactionId: MOCK_TXN_ID });

			render();
			fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => {
				expect(getVerifyOtpButton()).toBeInTheDocument();
			});
		});

		it("should call the verify OTP API with the transaction ID and OTP", async () => {
			const postSpy = jest
				.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValueOnce({ transactionId: MOCK_TXN_ID })
				.mockResolvedValueOnce({ additionalData: { token: "mock-token" } });

			render();
			fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());
			fireEvent.change(getOtpInput(), { target: { value: MOCK_OTP } });
			fireEvent.click(getVerifyOtpButton());

			await waitFor(() => {
				expect(postSpy).toHaveBeenNthCalledWith(
					2,
					VERIFY_OTP_URL,
					expect.objectContaining({ otp: MOCK_OTP, transactionId: MOCK_TXN_ID })
				);
			});
		});

		it("should show verify OTP error on API failure", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValueOnce({ transactionId: MOCK_TXN_ID })
				.mockRejectedValueOnce(new Error());

			render();
			fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());
			fireEvent.change(getOtpInput(), { target: { value: MOCK_OTP } });
			fireEvent.click(getVerifyOtpButton());

			await waitFor(() => {
				expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.OTP_VERIFICATION_FAILED)).toBeInTheDocument();
			});
		});

		it("should submit verified value with correct shape", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValueOnce({ transactionId: MOCK_TXN_ID })
				.mockResolvedValueOnce({ additionalData: { token: "mock-token" } });

			render();
			fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());
			fireEvent.change(getOtpInput(), { target: { value: MOCK_OTP } });
			fireEvent.click(getVerifyOtpButton());

			await waitFor(() => expect(screen.queryByRole("button", { name: "Verify" })).not.toBeInTheDocument());
			fireEvent.click(getSubmitButton());

			await waitFor(() => {
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						[COMPONENT_ID]: expect.objectContaining({
							type: "email",
							state: "verified",
							additionalData: { token: "mock-token" },
						}),
					})
				);
			});
		});

		it("should show EMAIL_VERIFICATION_REQUIRED on submit when not verified", async () => {
			render();

			await waitFor(() => fireEvent.click(getSubmitButton()));

			await waitFor(() => {
				expect(
					screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.EMAIL_VERIFICATION_REQUIRED)
				).toBeInTheDocument();
			});
			expect(SUBMIT_FN).not.toHaveBeenCalled();
		});

		it("should show OTP_REQUIRED on submit when OTP was sent but not verified", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ transactionId: MOCK_TXN_ID });

			render();
			fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
			fireEvent.click(getSendOtpButton());

			await waitFor(() => expect(getVerifyOtpButton()).toBeInTheDocument());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			await waitFor(() => {
				expect(screen.getByText(ERROR_MESSAGES.OTP_VERIFICATION.OTP_REQUIRED)).toBeInTheDocument();
			});
			expect(SUBMIT_FN).not.toHaveBeenCalled();
		});

		describe("defaultValues", () => {
			it("should support default verified email OTP value", async () => {
				render(undefined, { defaultValues: { [COMPONENT_ID]: VERIFIED_EMAIL_DEFAULT_VALUE } });

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: VERIFIED_EMAIL_DEFAULT_VALUE })
				);
			});
		});

		describe("reset", () => {
			it("should clear email OTP value on reset", async () => {
				renderComponent(EMAIL_OPTIONAL_SCHEMA);

				fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
				fireEvent.click(getResetButton());
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(getEmailInput()).toHaveValue("");
				expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
			});

			it("should revert to default verified email OTP value on reset", async () => {
				render(undefined, { defaultValues: { [COMPONENT_ID]: VERIFIED_EMAIL_DEFAULT_VALUE } });

				fireEvent.change(getEmailInput(), { target: { value: "updated@example.com" } });
				fireEvent.click(getResetButton());
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: VERIFIED_EMAIL_DEFAULT_VALUE })
				);
			});
		});

		describe("dirty state", () => {
			let formIsDirty: boolean;
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				formIsDirty = ref.current.isDirty;
			};

			beforeEach(() => {
				formIsDirty = undefined;
			});

			it("should mount without setting field state as dirty", () => {
				rtlRender(<FrontendEngineWithCustomButton data={EMAIL_SCHEMA} onClick={handleClick} />);
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(false);
			});

			it("should set form state as dirty if user modifies the email OTP field", () => {
				rtlRender(<FrontendEngineWithCustomButton data={EMAIL_SCHEMA} onClick={handleClick} />);
				fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(true);
			});

			it("should support default verified value without setting form state as dirty", () => {
				rtlRender(
					<FrontendEngineWithCustomButton
						data={{ ...EMAIL_SCHEMA, defaultValues: { [COMPONENT_ID]: VERIFIED_EMAIL_DEFAULT_VALUE } }}
						onClick={handleClick}
					/>
				);
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(false);
			});

			it("should reset and revert email OTP form dirty state to false", () => {
				rtlRender(<FrontendEngineWithCustomButton data={EMAIL_SCHEMA} onClick={handleClick} />);
				fireEvent.change(getEmailInput(), { target: { value: MOCK_VALID_EMAIL } });
				fireEvent.click(getResetButton());
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(false);
			});

			it("should reset to default verified value without setting form state as dirty", () => {
				rtlRender(
					<FrontendEngineWithCustomButton
						data={{ ...EMAIL_SCHEMA, defaultValues: { [COMPONENT_ID]: VERIFIED_EMAIL_DEFAULT_VALUE } }}
						onClick={handleClick}
					/>
				);
				fireEvent.change(getEmailInput(), { target: { value: "updated@example.com" } });
				fireEvent.click(getResetButton());
				fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

				expect(formIsDirty).toBe(false);
			});
		});
	});

	labelTestSuite((overrideField: unknown) =>
		renderComponent(
			buildSchema({
				type: "phone-number",
				validation: [{ "otp-type": "phone-number" }, { required: true }],
			}),
			overrideField as TOverrideField<IOtpVerificationFieldSchema>
		)
	);
	warningTestSuite({
		label: COMPONENT_LABEL,
		uiType: UI_TYPE,
		type: "phone-number",
		request: { endpoint: { url: SEND_OTP_URL } },
		verification: { endpoint: { url: VERIFY_OTP_URL } },
	});
});
