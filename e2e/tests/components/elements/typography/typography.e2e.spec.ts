import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/typography");

test.describe("Typography", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("variants"),
			},
		});

		test("Variants", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("weights"),
			},
		});

		test("Weights", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("array"),
			},
		});

		test("Text Array", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("inline"),
			},
		});

		test("Inline Text", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("paragraph"),
			},
		});

		test("Paragraph", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("view-more"),
			},
		});

		test("View More", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
