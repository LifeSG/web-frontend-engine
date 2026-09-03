import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/button");

test.describe("Button", () => {
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
});
