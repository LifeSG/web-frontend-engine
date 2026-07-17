import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/alert");

test.describe("Alert", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("alert"),
			},
		});

		test("Variants", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
