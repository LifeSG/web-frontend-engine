import { createStoryTest } from "../../../utils/fixtures";

const createPopoverTest = (story: string) =>
	createStoryTest({
		component: "elements/popover",
		story,
		createLocators: (page) => ({
			defaultPopover: page.getByTestId("popover-default__popover"),
		}),
	});

const defaultTest = createPopoverTest("default");

defaultTest.describe(() => {
	defaultTest("Default", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	defaultTest("Popover hint", async ({ story }) => {
		await story.goto();

		await story.locators.defaultPopover.click();
		await story.snapshot("open", { fullscreen: true });
	});
});
