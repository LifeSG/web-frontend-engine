import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/slider");

test.describe("Slider", () => {
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
