import { createStoryTest, expect, test } from "../../../utils/fixtures";

const createWrapperTest = (story: string) =>
	createStoryTest({
		component: "elements/wrapper",
		story,
		createLocators: (page) => ({
			complexLabel: {
				hintPopover: page.getByTestId("field1-popover"),
				hintContent: page.getByTestId("card").getByText("Please enter your full legal name"),
				hintContentMobile: page.getByTestId("modal-content").getByText("Please enter your full legal name"),
				shownField: page.getByTestId("field1__text-field-base"),
			},
			conditionalRenderer: {
				triggerField: page.getByRole("textbox", { name: "Trigger field" }),
				shownField: page.getByTestId("shownField__text-field-base"),
				nestedShownField: page.getByTestId("nestedShownField__text-field-base"),
			},
		}),
	});

const columnLayoutTest = createWrapperTest("column-layout");
const complexLabelTest = createWrapperTest("complex-label");
const conditionalRendererTest = createWrapperTest("conditional-renderer");

test.describe("Wrapper", () => {
	test.describe("Column layout", () => {
		columnLayoutTest("Desktop", async ({ story }) => {
			await story.goto();

			await story.snapshot("mount");
		});

		columnLayoutTest("Mobile", async ({ story }) => {
			await story.setViewport({ size: "mobile" });
			await story.goto();

			await story.snapshot("mount");
		});
	});

	test.describe("Complex label", () => {
		complexLabelTest("Main label and sublabel", async ({ story }) => {
			await story.goto();

			await expect(story.locators.complexLabel.shownField).toBeVisible();
			await story.snapshot("mount");
		});

		complexLabelTest("Hint display", async ({ story }) => {
			await story.goto();

			await test.step("Open popover", async () => {
				await story.locators.complexLabel.hintPopover.click();
			});

			await test.step("Verify popover is visible", async () => {
				await expect(story.locators.complexLabel.hintContent).toBeVisible();
				await story.snapshot("hint-open");
			});
		});

		complexLabelTest("Hint display (mobile)", async ({ story }) => {
			await story.setViewport({ size: "mobile" });
			await story.goto();

			await test.step("Open popover", async () => {
				await story.locators.complexLabel.hintPopover.click();
			});

			await test.step("Verify popover is visible", async () => {
				await expect(story.locators.complexLabel.hintContentMobile).toBeVisible();
				await story.snapshot("hint-open", { fullscreen: true });
			});
		});
	});

	conditionalRendererTest("Conditional rendering", async ({ story }) => {
		await story.goto();

		await expect(story.locators.conditionalRenderer.shownField).not.toBeVisible();
		await expect(story.locators.conditionalRenderer.nestedShownField).not.toBeVisible();
		await story.snapshot("hidden");

		await story.locators.conditionalRenderer.triggerField.fill("show");

		await expect(story.locators.conditionalRenderer.shownField).toBeVisible();
		await expect(story.locators.conditionalRenderer.nestedShownField).toBeVisible();
		await story.snapshot("shown");
	});
});
