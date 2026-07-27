import { createStoryTest, forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/time-field");

const createTimeFieldTest = (story: string) =>
	createStoryTest({
		component: "fields/time-field",
		story,
		createLocators: () => ({}),
	});

const defaultTest = createTimeFieldTest("default");
const warningTest = createTimeFieldTest("warning");
const useCurrentTimeTest = createStoryTest({
	component: "fields/time-field",
	story: "use-current-time",
	useMockedTimestamp: true,
	createLocators: () => ({}),
});

defaultTest.describe("", () => {
	defaultTest("Default", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

warningTest.describe("", () => {
	warningTest("Warning", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

useCurrentTimeTest.describe(() => {
	useCurrentTimeTest("Use current time", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});
