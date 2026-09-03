import { createStoryTest, expect } from "../../../utils/fixtures";

const createMultiSelectTest = (story: string) =>
	createStoryTest({
		component: "fields/multi-select",
		story,
		createLocators: (page) => ({
			selector: page.getByTestId("selector"),
			dropdown: page.getByTestId("dropdown-list"),
		}),
	});

const defaultTest = createMultiSelectTest("default");
const warningTest = createMultiSelectTest("warning");

defaultTest("Default", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});

defaultTest("Dropdown", async ({ story }) => {
	await story.goto();

	await story.locators.selector.click();
	await expect(story.locators.dropdown).toBeVisible();
	await story.snapshot("open", { fullscreen: true });
});

warningTest("Warning", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});
