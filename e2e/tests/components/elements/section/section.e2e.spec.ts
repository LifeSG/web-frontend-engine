import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/section");

test.describe("Section", () => {
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
				...withStory("grid"),
			},
		});

		test("Grid", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("contained"),
			},
		});

		test("Contained", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
