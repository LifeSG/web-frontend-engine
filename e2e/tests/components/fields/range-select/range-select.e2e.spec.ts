import { createStoryTest } from "../../../utils/fixtures";

const createRangeSelectTest = (story: string) =>
	createStoryTest({
		component: "fields/range-select",
		story,
		createLocators: (page) => ({
			field: page.getByTestId("field-base"),
		}),
	});

const defaultTest = createRangeSelectTest("default");
const warningTest = createRangeSelectTest("warning");

defaultTest("Default", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});

defaultTest("Dropdown", async ({ story }) => {
	await story.goto();
	await story.locators.field.click();
	await story.snapshot("open", { fullscreen: true });
});

warningTest("Warning", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});
