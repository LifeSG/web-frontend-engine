import { createStoryTest, expect, test } from "../../../utils/fixtures";
import { copyTextToClipboard } from "../../../utils/clipboard";

const createNumericFieldTest = (story: string) =>
	createStoryTest({
		component: "fields/text-field",
		story,
		createLocators: (page) => ({
			input: page.getByRole("spinbutton"),
		}),
	});

const defaultTest = createNumericFieldTest("numeric-default");
const warningTest = createNumericFieldTest("numeric-warning");
const decimalTruncationTest = createNumericFieldTest("numeric-decimal-truncation");

test.describe("numeric-field", () => {
	defaultTest.describe(() => {
		defaultTest("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	warningTest.describe(() => {
		warningTest("Warning", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe("Exponential notation", () => {
		defaultTest.describe(() => {
			defaultTest("Typing", async ({ story }) => {
				await story.goto();

				await story.locators.input.click();
				await story.locators.input.press("5");
				await story.locators.input.press("e");
				await story.locators.input.press("E");
				await story.locators.input.press("3");

				await expect(story.locators.input).toHaveValue("53");
			});
		});

		defaultTest.describe(() => {
			defaultTest("Pasting", async ({ story }) => {
				await story.goto();

				await defaultTest.step("Paste containing 'e' notation is blocked", async () => {
					await copyTextToClipboard(story.page, "2e3");
					await story.locators.input.click();
					await story.locators.input.press("ControlOrMeta+V");

					await expect(story.locators.input).toHaveValue("");
				});

				await defaultTest.step("Plain number paste is accepted", async () => {
					await copyTextToClipboard(story.page, "42");
					await story.locators.input.click();
					await story.locators.input.press("ControlOrMeta+V");

					await expect(story.locators.input).toHaveValue("42");
				});
			});
		});
	});

	test.describe("Decimal truncation", () => {
		decimalTruncationTest.describe(() => {
			decimalTruncationTest("Typing", async ({ story }) => {
				await story.goto();

				await story.locators.input.fill("1.2345");

				await expect(story.locators.input).toHaveValue("1.23");
			});
		});

		decimalTruncationTest.describe(() => {
			decimalTruncationTest("Pasting", async ({ story }) => {
				await story.goto();

				await copyTextToClipboard(story.page, "1.2345");
				await story.locators.input.click();
				await story.locators.input.press("ControlOrMeta+V");

				await expect(story.locators.input).toHaveValue("1.23");
			});
		});
	});
});
