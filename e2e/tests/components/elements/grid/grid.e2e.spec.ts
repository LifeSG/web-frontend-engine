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
				...withStory("column-span"),
			},
		});

		test("Column Span", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("column-range"),
			},
		});

		test("Column Range", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
