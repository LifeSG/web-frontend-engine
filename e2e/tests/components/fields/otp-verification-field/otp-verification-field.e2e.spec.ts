import { type Page } from "@playwright/test";
import { timestamp } from "../../../consts";
import { createStoryTest, expect, test } from "../../../utils/fixtures";

const createOtpTest = (story: string) =>
	createStoryTest({
		component: "fields/otp-verification-field",
		story,
		createLocators: (page) => {
			const contactSection = page.getByTestId("field__otp-verification-field-base-contact");
			const verificationSection = page.getByTestId("field__otp-verification-field-base-verification");

			return {
				contactSection,
				phoneInput: contactSection.getByRole("textbox"),
				sendOtpButton: page.getByRole("button", { name: "Send OTP" }),
				verificationSection,
				otpInput: verificationSection.getByRole("spinbutton"),
				verifyButton: page.getByRole("button", { name: "Verify" }),
				countdown: verificationSection.getByTestId("field__otp-verification-field-base-verification-countdown"),
			};
		},
	});

const phoneNumberTest = createOtpTest("phone-number");
const emailTest = createOtpTest("email");
const warningTest = createOtpTest("warning");

async function mockApis(page: Page) {
	await page.route("/api/otp/send", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ transactionId: "mock-txn-123" }),
		})
	);
	await page.route("/api/otp/verify", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({}),
		})
	);
}

test.describe("OTP Verification Field", () => {
	phoneNumberTest("Phone number", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	emailTest("Email", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	warningTest("Warning", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	phoneNumberTest("Interaction", async ({ story }) => {
		const now = new Date(timestamp).getTime();
		await story.page.clock.install({ time: now - 30 * 1000 });

		await mockApis(story.page);
		await story.goto();

		await phoneNumberTest.step("Send OTP", async () => {
			await story.page.clock.pauseAt(now);

			await story.locators.phoneInput.fill("91234567");
			await story.locators.sendOtpButton.click();

			await story.page.clock.runFor(5000);

			await expect(story.locators.verificationSection).toBeVisible();
			await story.snapshot("sent");
		});

		await phoneNumberTest.step("Verify OTP", async () => {
			await story.locators.otpInput.fill("123456");
			await story.locators.verifyButton.click();

			await expect(story.locators.verificationSection).toBeHidden();
			await story.snapshot("verified");
		});
	});
});
