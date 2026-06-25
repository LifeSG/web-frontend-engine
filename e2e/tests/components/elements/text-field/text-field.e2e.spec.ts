import { expect, forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/text-field");

test.describe("Text Field", () => {
	test.describe("Warning", () => {
		test.use({
			storyOptions: {
				...withStory("warning"),
			},
		});

		test("state", async ({ story, page }) => {
			await story.goto();
			await expect(page.getByText("Primary warning message")).toBeVisible();

			await story.snapshot("warning");
		});
	});
});
