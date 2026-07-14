import { createStoryTest, expect } from "../../../utils/fixtures";

const createChipsTest = (story: string) =>
	createStoryTest({
		component: "fields/chips",
		story,
		createLocators: (page) => ({
			apple: page.getByRole("button", { name: "Apple" }),
			berry: page.getByRole("button", { name: "Berry" }),
			durian: page.getByRole("button", { name: "Durian" }),
			duriansTextarea: page.getByRole("textbox", { name: "Durian" }),
		}),
	});

const defaultTest = createChipsTest("default");
const withTextareaTest = createChipsTest("with-textarea");

defaultTest.describe("", () => {
	defaultTest("Default", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	defaultTest("With selection", async ({ story }) => {
		await story.goto();

		await story.locators.apple.click();
		await story.locators.berry.click();

		await story.snapshot("state");
	});
});

withTextareaTest.describe("", () => {
	withTextareaTest("With Textarea", async ({ story }) => {
		await story.goto();
		await story.snapshot("closed");

		await story.locators.durian.click();
		await expect(story.locators.duriansTextarea).toBeVisible();
		await story.snapshot("open");
	});
});
