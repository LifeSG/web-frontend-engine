import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/list");

test.describe("List", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("unordered-list"),
			},
		});

		test("Unordered List", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("ordered-list"),
			},
		});

		test("Ordered List", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
