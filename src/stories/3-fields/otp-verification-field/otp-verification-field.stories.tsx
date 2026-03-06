import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { LifeSGTheme } from "@lifesg/react-design-system/theme";
import { IOtpVerificationFieldSchema } from "../../../components/fields";
import { CommonFieldStoryProps, DefaultStoryTemplate, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";
import { ThemeProvider } from "styled-components";

const meta: Meta = {
	title: "Field/OtpVerificationField",
	decorators: [
		(Story) => (
			<ThemeProvider theme={LifeSGTheme}>
				<Story />
			</ThemeProvider>
		),
	],
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
					<ArgTypes of={PhoneNumber} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("otp-verification-field"),
		sendOtpRequest: {
			description: "Configuration for the Send OTP API endpoint",
			table: {
				type: {
					summary: "{ url: string; headers?: Record<string, string> }",
				},
			},
		},
		verifyOtpRequest: {
			description: "Configuration for the Verify OTP API endpoint",
			table: {
				type: {
					summary: "{ url: string; headers?: Record<string, string> }",
				},
			},
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
			description: "Duration (in seconds) for the resend OTP countdown timer",
			table: {
				type: { summary: "number" },
				defaultValue: { summary: "60" },
			},
			control: { type: "number" },
		},
		sendOtpPlaceholder: {
			description: "Placeholder text for the contact input",
			table: {
				type: { summary: "string" },
			},
		},
	},
};
export default meta;

export const PhoneNumber = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-phone-number").bind({});
PhoneNumber.args = {
	uiType: "otp-verification-field",
	label: "Mobile Number Verification",
	sendOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/send-otp" },
	verifyOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/verify-otp" },
	validation: [{ "otp-type": "phone-number" }],
};

export const Email = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-email").bind({});
Email.args = {
	uiType: "otp-verification-field",
	label: "Email Verification",
	sendOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/send-otp" },
	verifyOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/verify-otp" },
	validation: [{ "otp-type": "email" }],
};

export const Required = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-required").bind({});
Required.args = {
	uiType: "otp-verification-field",
	label: "Mobile Number Verification (Required)",
	sendOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/send-otp" },
	verifyOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/verify-otp" },
	validation: [{ "otp-type": "phone-number" }, { required: true, errorMessage: "OTP verification is required." }],
};

export const CustomTimer = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-custom-timer").bind({});
CustomTimer.args = {
	uiType: "otp-verification-field",
	label: "Mobile Number Verification",
	sendOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/send-otp" },
	verifyOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/verify-otp" },
	validation: [{ "otp-type": "phone-number" }],
	verifyOtpCountdownTimer: 30,
};

export const Disabled = DefaultStoryTemplate<IOtpVerificationFieldSchema>("otp-disabled").bind({});
Disabled.args = {
	uiType: "otp-verification-field",
	label: "Mobile Number Verification",
	sendOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/send-otp" },
	verifyOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/verify-otp" },
	validation: [{ "otp-type": "phone-number" }],
	disabled: true,
};

export const Overrides = OverrideStoryTemplate<IOtpVerificationFieldSchema>("otp-overrides").bind({});
Overrides.args = {
	uiType: "otp-verification-field",
	label: "Mobile Number Verification",
	sendOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/send-otp" },
	verifyOtpRequest: { url: "https://ba8f82df-a2b3-460a-8e96-b98043e3b10d.mock.pstmn.io/webhook/verify-otp" },
	validation: [{ "otp-type": "phone-number" }],
	overrides: {
		label: "Overriden Mobile Number Verification",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
