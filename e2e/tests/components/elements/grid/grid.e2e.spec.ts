import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/grid");

test.describe("Grid", () => {
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
				...withStory("custom"),
			},
		});

		test("Custom", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
