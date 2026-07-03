import { expect, forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/hidden-field");

test.describe("HiddenField", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Default", async ({ story, page }) => {
			await story.goto();
			await expect(page.getByTestId("hidden-field")).toBeHidden();
			await story.snapshot("mount");
		});
	});
});
