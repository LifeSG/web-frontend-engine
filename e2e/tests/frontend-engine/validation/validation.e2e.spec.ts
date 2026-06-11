import { type Locator, type Page } from "@playwright/test";
import { test as base, expect } from "../../utils/fixtures";
import { StoryPage } from "../../utils/story-page";

class FrontendEngineValidationPage extends StoryPage {
	public readonly locators: {
		validationPage: Locator;
		form: Locator;
	};

	public constructor(page: Page) {
		super(page, { component: "frontend-engine/validation", story: "default" });
		this.locators = {
			validationPage: page.getByTestId("frontend-engine-validation-page"),
			form: page.locator("form"),
		};
	}
}

const test = base.extend<{ story: FrontendEngineValidationPage }>({
	story: async ({ page }, use) => {
		const story = new FrontendEngineValidationPage(page);
		await use(story);
	},
});

test("frontend-engine validation story renders basic form", async ({ story }) => {
	await story.goto();
	await expect(story.locators.validationPage).toBeVisible();
	await expect(story.locators.form).toBeVisible();
	await expect(story.locators.form.getByLabel("Email")).toBeVisible();
	await expect(story.locators.form.getByPlaceholder("Enter your email")).toBeVisible();
});
