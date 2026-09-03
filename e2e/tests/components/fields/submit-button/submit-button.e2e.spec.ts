import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/submit-button");

test.describe("SubmitButton", () => {
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
