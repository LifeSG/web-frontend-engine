import { expect, forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/wrapper");

test.describe("Wrapper", () => {
	test.describe("Column layout", () => {
		test.use({
			storyOptions: {
				...withStory("column-layout"),
			},
		});

		test("renders fields in grid columns", async ({ story }) => {
			await story.goto();
			await story.snapshot("column-layout");
		});
	});

	test.describe("Complex label", () => {
		test.use({
			storyOptions: {
				...withStory("complex-label"),
			},
		});

		test("renders main label and sublabel", async ({ story }) => {
			await story.goto();
			await story.snapshot("complex-label-default");
		});

		test("opens hint popover on click", async ({ story }) => {
			await story.goto();

			await test.step("click hint icon to open popover", async () => {
				const popoverTrigger = story.page.getByTestId("field1-popover");
				await popoverTrigger.click();
			});

			await test.step("verify popover content is visible", async () => {
				const popoverContent = story.page.getByText("Please enter your full legal name");
				await popoverContent.waitFor({ state: "visible" });
			});

			await story.snapshot("complex-label-hint-open");
		});
	});

	test.describe("Conditional renderer", () => {
		test.use({
			storyOptions: {
				...withStory("conditional-renderer"),
			},
		});

		test("keeps conditional fields hidden by default", async ({ story }) => {
			await story.goto();
			await expect(story.page.getByTestId("shownField__text-field-base")).toHaveCount(0);
			await expect(story.page.getByTestId("nestedShownField__text-field-base")).toHaveCount(0);
			await story.snapshot("conditional-renderer-hidden");
		});

		test("shows conditional fields when trigger matches", async ({ story }) => {
			await story.goto();

			await test.step("set trigger field value", async () => {
				await story.page.getByRole("textbox", { name: "Trigger field" }).fill("show");
			});

			await test.step("assert dependent fields are visible", async () => {
				await story.page.getByTestId("shownField__text-field-base").waitFor({ state: "visible" });
				await story.page.getByTestId("nestedShownField__text-field-base").waitFor({ state: "visible" });
			});

			await story.snapshot("conditional-renderer-shown");
		});
	});
});
