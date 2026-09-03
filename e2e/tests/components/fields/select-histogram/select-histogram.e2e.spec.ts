import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/select-histogram");

test.describe("SelectHistogram", () => {
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

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("warning"),
			},
		});

		test("Warning", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
