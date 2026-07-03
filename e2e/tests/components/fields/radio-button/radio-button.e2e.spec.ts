import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/radio-button");

test.describe("Radio Button", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("default");
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

test.describe("Radio Toggle Button", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-default"),
			},
		});

		test("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("toggle-default");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-vertical"),
			},
		});

		test("Vertical layout", async ({ story }) => {
			await story.goto();
			await story.snapshot("toggle-vertical");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-overflow"),
			},
		});

		test("Overflow", async ({ story }) => {
			await story.goto();
			await story.snapshot("toggle-overflow");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-nested"),
			},
		});

		test("Nested fields", async ({ story }) => {
			await story.goto();
			await story.snapshot("toggle-nested");
		});
	});
});

test.describe("Radio Image Button", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("image-button-default"),
			},
		});

		test("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("image-button-default");
		});
	});
});
