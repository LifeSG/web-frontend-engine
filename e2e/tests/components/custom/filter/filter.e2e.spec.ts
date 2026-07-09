import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("custom/filter");

test.describe("Filter", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Default rendering", async ({ story }) => {
			await story.goto();
			await story.snapshot("default");
		});
	});
});
