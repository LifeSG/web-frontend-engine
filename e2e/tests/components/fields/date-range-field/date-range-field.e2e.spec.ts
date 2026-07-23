import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/date-range-field");

test.describe("Date Range Field", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Default rendering", async ({ story }) => {
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

		test("Warning display", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
