import { createStoryTest } from "../../../utils/fixtures";

const createNestedMultiSelectTest = (story: string) =>
	createStoryTest({
		component: "fields/nested-multi-select",
		story,
		createLocators: (page) => ({
			trigger: page.getByTestId("selector"),
		}),
	});

const defaultTest = createNestedMultiSelectTest("default");
const warningTest = createNestedMultiSelectTest("warning");

defaultTest("Default rendering", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});

defaultTest("Dropdown open", async ({ story }) => {
	await story.goto();
	await story.locators.trigger.click();
	await story.snapshot("open", { fullscreen: true });
});

warningTest("Warning state", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});
