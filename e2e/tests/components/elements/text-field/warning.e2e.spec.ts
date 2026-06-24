import { type Locator, type Page } from "@playwright/test";
import { test as base, expect } from "../../../utils/fixtures";
import { compareScreenshot } from "../../../utils/compare-screenshot";
import { StoryPage } from "../../../utils/story-page";

class TextFieldWarningStoryPage extends StoryPage {
	public readonly locators: {
		primaryTextField: Locator;
		secondaryTextField: Locator;
		primaryWarning: Locator;
	};

	public constructor(page: Page) {
		super(page, { component: "elements/text-field", story: "warning" });

		this.locators = {
			primaryTextField: page.getByRole("textbox", { name: "Primary text field" }),
			secondaryTextField: page.getByRole("textbox", { name: "Secondary text field" }),
			primaryWarning: page.getByText("Primary warning message"),
		};
	}
}

const test = base.extend<{ story: TextFieldWarningStoryPage }>({
	story: async ({ page }, runStory) => {
		const story = new TextFieldWarningStoryPage(page);
		await runStory(story);
	},
});

test.describe("Text Field Warning", () => {
	test("state", async ({ story, page }) => {
		await story.goto();
		await expect(story.locators.primaryWarning).toBeVisible();

		await compareScreenshot(page, "mount");
	});

	test("warning remains while typing", async ({ story }) => {
		await story.goto();
		await expect(story.locators.primaryWarning).toBeVisible();

		await story.locators.primaryTextField.fill("Alice");

		await expect(story.locators.primaryTextField).toHaveValue("Alice");
		await expect(story.locators.primaryWarning).toBeVisible();
	});
});
