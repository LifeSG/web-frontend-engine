import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("custom/iframe");

test.describe("Iframe", () => {
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
});
