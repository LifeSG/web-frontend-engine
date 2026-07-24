import { createStoryTest } from "../../../utils/fixtures";

const createSelectTest = (story: string) =>
	createStoryTest({
		component: "fields/select",
		story,
		createLocators: (page) => ({
			trigger: page.getByTestId("selector"),
		}),
	});

const defaultTest = createSelectTest("default");
const warningTest = createSelectTest("warning");

defaultTest.describe(() => {
	defaultTest("Default", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	defaultTest("Dropdown open", async ({ story }) => {
		await story.goto();
		await story.locators.trigger.click();
		await story.snapshot("open", { fullscreen: true });
	});
});

warningTest.describe(() => {
	warningTest("Warning", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});
