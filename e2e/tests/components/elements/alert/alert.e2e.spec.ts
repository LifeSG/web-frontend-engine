import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/alert");

test.describe("Alert", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("success"),
			},
		});

		test("Success", async ({ story }) => {
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

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("error"),
			},
		});

		test("Error", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
