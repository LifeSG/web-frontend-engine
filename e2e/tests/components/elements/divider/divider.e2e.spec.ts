import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/divider");

test.describe("Divider", () => {
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
				...withStory("vertical-margin"),
			},
		});

		test("Vertical Margin", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
