import { createStoryTest, expect, test } from "../../../utils/fixtures";
import { copyTextToClipboard } from "../../../utils/clipboard";

const createTextFieldTest = (story: string) =>
	createStoryTest({
		component: "fields/text-field",
		story,
		createLocators: (page) => ({
			input: page.getByRole("textbox"),
			defaultInput: page.getByRole("textbox", { name: "Default" }),
			customInput: page.getByRole("textbox", { name: "Custom" }),
			dragSource: page.getByTestId("drag-source"),
		}),
	});

const defaultTest = createTextFieldTest("text-default");
const warningTest = createTextFieldTest("text-warning");
const preventCopyAndPasteTest = createTextFieldTest("prevent-copy-and-paste");
const preventDragAndDropTest = createTextFieldTest("prevent-drag-and-drop");
const uppercaseTest = createTextFieldTest("uppercase");
const addonIconTest = createTextFieldTest("addon-icon");

test.describe("text-field", () => {
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

	preventCopyAndPasteTest.describe(() => {
		preventCopyAndPasteTest("Prevent copy and paste", async ({ story }) => {
			await story.goto();

			await copyTextToClipboard(story.page, "copied text");

			await story.locators.defaultInput.click();
			await story.locators.defaultInput.press("ControlOrMeta+V");

			await story.locators.customInput.click();
			await story.locators.customInput.press("ControlOrMeta+V");

			await expect(story.locators.defaultInput).toHaveValue("copied text");
			await expect(story.locators.customInput).toHaveValue("");
		});
	});

	preventDragAndDropTest.describe(() => {
		preventDragAndDropTest("Prevent drag and drop", async ({ story }) => {
			await story.goto();

			await story.locators.dragSource.dragTo(story.locators.defaultInput);
			await story.locators.dragSource.dragTo(story.locators.customInput);

			await expect(story.locators.defaultInput).toHaveValue("https://example.com/");
			await expect(story.locators.customInput).toHaveValue("");
		});
	});

	uppercaseTest.describe(() => {
		uppercaseTest("Uppercase transform maintains caret position", async ({ story }) => {
			await story.goto();

			await uppercaseTest.step("Type lowercase text at the start", async () => {
				await story.locators.input.fill("abc");

				await expect(story.locators.input).toHaveValue("ABC");

				const caretPos = await story.locators.input.evaluate((el: HTMLInputElement) => el.selectionStart);
				expect(caretPos).toBe(3);
			});

			await uppercaseTest.step("Type lowercase text in the middle", async () => {
				await story.locators.input.evaluate((el: HTMLInputElement) => el.setSelectionRange(1, 1));
				await story.page.keyboard.type("xyz");

				await expect(story.locators.input).toHaveValue("AXYZBC");

				const caretPos = await story.locators.input.evaluate((el: HTMLInputElement) => el.selectionStart);
				expect(caretPos).toBe(4);
			});
		});
	});

	addonIconTest.describe(() => {
		addonIconTest("Addon icon", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
