import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Decorator, Meta } from "@storybook/react";
import axios from "axios";
import { useEffect } from "react";
import { IOtpVerificationFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, DefaultStoryTemplate, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Field/OtpVerificationField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>OtpVerificationField</Title>
					<p>
						This component provides a two-step OTP verification flow. The user enters a contact (phone
						number or email), requests an OTP via a backend API, then verifies the OTP with a second API
						call.
					</p>
					<p>
						The field value is set only after successful verification and contains the contact, type, state,
						and any additional data returned by the backend.
					</p>
					<p>
						Validation state transitions:
						<ul>
							<li>
								<strong>default</strong> — contact not yet submitted; shows
								email/phone-verification-required error on contact section
							</li>
							<li>
								<strong>sent</strong> — OTP sent; shows OTP-required error on verification section
							</li>
							<li>
								<strong>verified</strong> — OTP verified; form submission allowed
							</li>
						</ul>
					</p>
					<ArgTypes of={PhoneNumber} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("otp-verification-field"),
		type: {
			description: "Whether the field collects a phone number or email address",
			table: {
				type: { summary: `"phone-number" | "email"` },
			},
			options: ["phone-number", "email"],
			control: { type: "select" },
		},
		request: {
			description: `Configuration for the Send OTP API endpoint.

**Request body** (\`POST request.endpoint.url\`):
- \`type\` — \`"phone-number"\` or \`"email"\`
- \`phoneNo\` — present when type is \`phone-number\`; includes country code (e.g. \`+6591234567\`)
- \`email\` — present when type is \`email\`
- \`withPrefix\` — optional; only included when \`withPrefix\` is set

**Response:**
- \`transactionId\` — required; used to correlate the subsequent verify call
- \`prefix\` — optional; returned when \`withPrefix\` is true

**Error response (4xx / 5xx):**
- \`message\` — optional; displayed to the user as the field error message`,
			table: {
				type: {
					summary: "{ endpoint: { url: string } }",
				},
			},
		},
		verification: {
			description: `Configuration for the Verify OTP API endpoint and verification step display.

**Request body** (\`POST verification.endpoint.url\`):
- \`transactionId\` — value returned by the Send OTP response
- \`otp\` — OTP entered by the user
- \`otpPrefix\` — OTP prefix displayed to the user (empty string when no prefix)

**Response:**
- \`additionalData\` — optional; any extra data to include in the field value

**Error response (4xx / 5xx):**
- \`message\` — optional; displayed to the user as the field error message`,
			table: {
				type: {
					summary: "{ endpoint: { url: string }; showThumbnail?: boolean; title?: string; message?: string }",
				},
			},
		},
		withPrefix: {
			description:
				"Set to `true` to request the backend to generate an OTP prefix, which will be displayed to the user alongside the OTP input.",
			table: {
				type: { summary: "boolean" },
			},
			control: { type: "boolean" },
		},
		disabled: {
			description: "Disables the component",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
			control: { type: "boolean" },
		},
		readOnly: {
			description: "Sets the component to read-only",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
			control: { type: "boolean" },
		},

		verifyOtpCountdownTimer: {
			description: "Duration in seconds for the resend OTP countdown timer",
			table: {
				type: { summary: "number" },
				defaultValue: { summary: "60" },
			},
			control: { type: "number" },
		},
		sendOtpPlaceholder: {
			description: "Placeholder text for the contact input (phone number or email)",
			table: {
				type: { summary: "string" },
			},
			control: { type: "text" },
		},
		prefixSeparator: {
			description:
				"Custom separator string displayed between the OTP prefix and the OTP input. Only relevant when the backend returns a prefix (`withPrefix: true`).",
			table: {
				type: { summary: "string" },
			},
			control: { type: "text" },
		},
	},
};
export default meta;

// =============================================================================
// MOCK SETUP
// =============================================================================

const MOCK_SEND_OTP_URL = "/mock/send-otp";
const MOCK_SEND_OTP_PREFIXED_URL = "/mock/send-otp-prefixed";
const MOCK_VERIFY_OTP_URL = "/mock/verify-otp";

/** Atomic mock handlers — compose with spread to build story-level handler maps. null = throw 500 */
const MOCK_SEND_OK: Record<string, unknown> = {
	[MOCK_SEND_OTP_URL]: { transactionId: "mock-txn-123" },
	[MOCK_SEND_OTP_PREFIXED_URL]: { transactionId: "mock-txn-123", prefix: "SG-" },
};
const MOCK_VERIFY_OK: Record<string, unknown> = { [MOCK_VERIFY_OTP_URL]: {} };
const MOCK_SEND_ERROR: Record<string, unknown> = {
	[MOCK_SEND_OTP_URL]: null,
	[MOCK_SEND_OTP_PREFIXED_URL]: null,
};
const MOCK_VERIFY_ERROR: Record<string, unknown> = { [MOCK_VERIFY_OTP_URL]: null };

/**
 * Storybook decorator that intercepts axios requests and returns mocked responses.
 * Matches URLs by substring. null values simulate a 500 server error.
 */
const withMockOtpApi =
	(handlers: Record<string, unknown>): Decorator =>
	(Story) => {
		useEffect(() => {
			const originalAdapter = axios.defaults.adapter;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			axios.defaults.adapter = async (config: any) => {
				await new Promise((resolve) => setTimeout(resolve, 400));
				const match = Object.keys(handlers).find((key) => config.url?.includes(key));
				if (match) {
					if (handlers[match] === null) {
						throw Object.assign(new Error("Request failed with status code 500"), {
							config,
							response: { status: 500, data: { message: "Internal server error" }, headers: {}, config },
						});
					}
					return { data: handlers[match], status: 200, statusText: "OK", headers: {}, config, request: {} };
				}
				throw Object.assign(new Error(`No mock registered for: ${config.url}`), { config });
			};
			return () => {
				axios.defaults.adapter = originalAdapter;
			};
		}, []);
		return <Story />;
	};

// =============================================================================
// BASIC TYPES
// =============================================================================
export const PhoneNumber = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-phone-number").bind({});
PhoneNumber.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		showThumbnail: true,
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	validation: [{ "otp-type": "phone-number" }, { required: true }],
};
PhoneNumber.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_OK })];

export const Email = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-email").bind({});
Email.args = {
	uiType: "otp-verification-field",
	label: "Email Verification",
	type: "email",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		showThumbnail: true,
		title: "Verify your email address",
		message: "Enter the OTP sent to your email address to verify.",
	},
	validation: [{ "otp-type": "email" }, { required: true }],
};
Email.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_OK })];

// =============================================================================
// ERROR STATES
// =============================================================================

/** Simulates the send OTP API returning a server error. */
export const SendOtpFailed = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-send-failed").bind({});
SendOtpFailed.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		showThumbnail: true,
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	validation: [{ "otp-type": "phone-number" }],
};
SendOtpFailed.decorators = [withMockOtpApi({ ...MOCK_SEND_ERROR, ...MOCK_VERIFY_OK })];

/** Simulates the verify OTP API returning a server error (send OTP succeeds). */
export const VerifyOtpFailed = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-verify-failed").bind({});
VerifyOtpFailed.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		showThumbnail: true,
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	validation: [{ "otp-type": "phone-number" }],
};
VerifyOtpFailed.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_ERROR })];

// =============================================================================
// OTP DISPLAY OPTIONS
// =============================================================================

/** The backend returns an OTP prefix (e.g. "SG-") when `withPrefix: true` is sent in the request body.
 *  The prefix is displayed alongside the OTP input to help users identify the correct code. */
export const WithPrefix = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-with-prefix").bind({});
WithPrefix.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_PREFIXED_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		showThumbnail: true,
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	withPrefix: true,
	validation: [{ "otp-type": "phone-number" }],
};
WithPrefix.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_OK })];

/** Custom separator between the OTP prefix and the OTP input. Defaults to "-" when not set. */
export const WithPrefixSeparator = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-with-prefix-separator").bind(
	{}
);
WithPrefixSeparator.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_PREFIXED_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		showThumbnail: true,
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	withPrefix: true,
	prefixSeparator: ":",
	validation: [{ "otp-type": "phone-number" }],
};
WithPrefixSeparator.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_OK })];

/** Shows the OTP verification step without a thumbnail illustration (default behaviour). */
export const WithoutThumbnail = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-without-thumbnail").bind({});
WithoutThumbnail.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	validation: [{ "otp-type": "phone-number" }],
};
WithoutThumbnail.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_OK })];

// =============================================================================
// CUSTOMISATION
// =============================================================================

/** Custom placeholder text for the contact input. */
export const WithPlaceholder = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-with-placeholder").bind({});
WithPlaceholder.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		showThumbnail: true,
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	sendOtpPlaceholder: "Enter your mobile number",
	validation: [{ "otp-type": "phone-number" }],
};
WithPlaceholder.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_OK })];

/** Custom resend countdown timer duration. */
export const CustomTimer = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-custom-timer").bind({});
CustomTimer.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	validation: [{ "otp-type": "phone-number" }],
	verifyOtpCountdownTimer: 30,
};
CustomTimer.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_OK })];

// =============================================================================
// STATES
// =============================================================================

export const Disabled = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-disabled").bind({});
Disabled.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: { endpoint: { url: MOCK_VERIFY_OTP_URL }, showThumbnail: true },
	validation: [{ "otp-type": "phone-number" }],
	disabled: true,
};

export const ReadOnly = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-read-only").bind({});
ReadOnly.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: { endpoint: { url: MOCK_VERIFY_OTP_URL }, showThumbnail: true },
	validation: [{ "otp-type": "phone-number" }],
	readOnly: true,
};

// =============================================================================
// OVERRIDES
// =============================================================================

export const Overrides = OverrideStoryTemplate<IOtpVerificationFieldSchema>("otp-overrides").bind({});
Overrides.args = {
	uiType: "otp-verification-field",
	type: "phone-number",
	label: "Mobile Number Verification",
	request: { endpoint: { url: MOCK_SEND_OTP_URL } },
	verification: {
		endpoint: { url: MOCK_VERIFY_OTP_URL },
		showThumbnail: true,
		title: "Verify your mobile number",
		message: "Enter the OTP sent to your mobile number to verify.",
	},
	validation: [{ "otp-type": "phone-number" }],
	overrides: {
		label: "Overridden Mobile Number Verification",
		verification: {
			title: "Overridden OTP title",
			message: "Overridden OTP message",
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
Overrides.decorators = [withMockOtpApi({ ...MOCK_SEND_OK, ...MOCK_VERIFY_OK })];
