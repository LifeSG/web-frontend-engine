import { type Locator, type Page } from "@playwright/test";
import { test as base, expect } from "../../utils/fixtures";
import { StoryPage } from "../../utils/story-page";

class FrontendEngineExamplePage extends StoryPage {
	public readonly locators: {
		examplePage: Locator;
		form: Locator;
	};

	public constructor(page: Page) {
		super(page, { component: "frontend-engine/example", story: "default" });
		this.locators = {
			examplePage: page.getByTestId("frontend-engine-example-page"),
			form: page.locator("form"),
		};
	}
}

const test = base.extend<{ story: FrontendEngineExamplePage }>({
	story: async ({ page }, use) => {
		const story = new FrontendEngineExamplePage(page);
		await use(story);
	},
});

test("frontend-engine example story renders basic form", async ({ story }) => {
	await story.goto();
	await expect(story.locators.examplePage).toBeVisible();
	await expect(story.locators.form).toBeVisible();
	await expect(story.locators.form.getByLabel("Email")).toBeVisible();
	await expect(story.locators.form.getByPlaceholder("Enter your email")).toBeVisible();
});
