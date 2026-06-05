import { type Locator, type Page } from "@playwright/test";
import { test as base, expect } from "../../utils/fixtures";
import { StoryPage } from "../../utils/story-page";

class FrontendEngineValidationPage extends StoryPage {
	public readonly locators: {
		validationPage: Locator;
		emailInput: Locator;
		feeValidationValidity: Locator;
	};

	public constructor(page: Page) {
		super(page, { component: "frontend-engine/validation", story: "default" });
		this.locators = {
			validationPage: page.getByTestId("frontend-engine-validation-page"),
			emailInput: page.getByRole("textbox", { name: "Email" }),
			feeValidationValidity: page.getByTestId("validation-validity"),
		};
	}
}

const test = base.extend<{ story: FrontendEngineValidationPage }>({
	story: async ({ page }, use) => {
		const story = new FrontendEngineValidationPage(page);
		await use(story);
	},
});

test("frontend-engine validation page renders", async ({ story }) => {
	await story.goto();
	await expect(story.locators.validationPage).toBeVisible();
	await expect(story.locators.feeValidationValidity).toHaveText("idle");
});

test("frontend-engine validation updates on change", async ({ story }) => {
	await story.goto();

	await story.locators.emailInput.fill("invalid");
	await expect(story.locators.feeValidationValidity).toHaveText("false");

	await story.locators.emailInput.fill("valid@email.com");
	await expect(story.locators.feeValidationValidity).toHaveText("true");
});
