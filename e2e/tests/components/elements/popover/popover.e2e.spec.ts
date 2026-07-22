import { createStoryTest, expect } from "../../../utils/fixtures";

const createPopoverTest = (story: string) =>
	createStoryTest({
		component: "elements/popover",
		story,
		createLocators: (page) => ({
			hoverPopover: page.getByTestId("popover-hover__popover"),
		}),
	});

const defaultTest = createPopoverTest("default");
const hoverTest = createPopoverTest("hover");

defaultTest.describe(() => {
	defaultTest("Default", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

hoverTest.describe(() => {
	hoverTest("Hover", async ({ story }) => {
		await story.goto();

		await story.locators.hoverPopover.hover();
		expect(story.locators.hoverPopover).toBeVisible();
		await story.snapshot("open", { fullscreen: true });
	});
});
