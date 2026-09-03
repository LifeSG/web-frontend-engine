import { createStoryTest } from "../../../utils/fixtures";

const createTextareaTest = (story: string) =>
	createStoryTest({
		component: "fields/textarea",
		story,
		createLocators: () => ({}),
	});

const chipsTopTest = createTextareaTest("chips-top");
const chipsBottomTest = createTextareaTest("chips-bottom");
const resizableVariantsTest = createTextareaTest("resizable-variants");
const warningTest = createTextareaTest("warning");

chipsTopTest("Chips top display", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});

chipsBottomTest("Chips bottom display", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});

resizableVariantsTest("Resizable variants", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});

warningTest("Warning", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});
