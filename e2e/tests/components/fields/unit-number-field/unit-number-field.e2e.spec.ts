import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/unit-number-field");

test.describe("UnitNumberField", () => {
	test.describe(() => {
		test.use({ storyOptions: withStory("default") });

		test("Basic rendering", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({ storyOptions: withStory("warning") });

		test("Warning display", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
