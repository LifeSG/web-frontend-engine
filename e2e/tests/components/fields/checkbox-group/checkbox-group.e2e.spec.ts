import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/checkbox-group");

test.describe("Checkbox Group", () => {
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

		test("Warning state", async ({ story }) => {
			await story.goto();
			await story.snapshot("warning");
		});
	});
});

test.describe("Checkbox Toggle Group", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-default"),
			},
		});

		test("Toggle default", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-overflow"),
			},
		});

		test("Toggle overflow", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-vertical"),
			},
		});

		test("Toggle vertical layout", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-nested"),
			},
		});

		test("Toggle with nested fields", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
