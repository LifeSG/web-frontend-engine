import { createStoryTest, expect } from "../../../utils/fixtures";

const createTextareaTest = (story: string) =>
	createStoryTest({
		component: "fields/textarea",
		story,
		createLocators: (page) => ({
			textareaWithChips: page.getByRole("textbox", { name: "Textarea with chips" }),
			textareaChipFocusBlur: page.getByRole("textbox", { name: "Textarea chip focus blur" }),
			pill1: page.getByRole("button", { name: "Pill 1" }),
			alpha: page.getByRole("button", { name: "Alpha" }),
		}),
	});

const chipsTopTest = createTextareaTest("chips-top");
const chipsBottomTest = createTextareaTest("chips-bottom");
const resizableVariantsTest = createTextareaTest("resizable-variants");

chipsTopTest.describe("", () => {
	chipsTopTest("Chips top display", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

chipsBottomTest.describe("", () => {
	chipsBottomTest("Chips bottom display", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

resizableVariantsTest.describe("", () => {
	resizableVariantsTest("Resizable variants", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});
