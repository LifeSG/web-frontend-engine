import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/masked-field");

test.describe("MaskedField", () => {
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
