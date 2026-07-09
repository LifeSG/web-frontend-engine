import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("custom/timeline");

test.describe("Timeline", () => {
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
