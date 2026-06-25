import { createStoryTest, expect } from "../../utils/fixtures";

const createExampleTest = (story: string) =>
	createStoryTest({
		component: "frontend-engine/example",
		story,
		createLocators: (page) => ({
			examplePage: page.getByTestId("frontend-engine-example-page"),
			form: page.locator("form"),
		}),
	});

const defaultTest = createExampleTest("default");
const withNameTest = createExampleTest("with-name");

defaultTest.describe("default", () => {
	defaultTest("renders email field", async ({ story }) => {
		await story.goto();
		await expect(story.locators.examplePage).toBeVisible();
		await expect(story.locators.form).toBeVisible();
		await expect(story.locators.form.getByLabel("Email")).toBeVisible();
		await expect(story.locators.form.getByPlaceholder("Enter your email")).toBeVisible();
	});
});

withNameTest.describe("with-name", () => {
	withNameTest("renders email and name fields", async ({ story }) => {
		await story.goto();
		await expect(story.locators.examplePage).toBeVisible();
		await expect(story.locators.form).toBeVisible();
		await expect(story.locators.form.getByLabel("Email")).toBeVisible();
		await expect(story.locators.form.getByLabel("Name")).toBeVisible();
	});
});
