import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/reset-button");

test.describe("ResetButton", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
