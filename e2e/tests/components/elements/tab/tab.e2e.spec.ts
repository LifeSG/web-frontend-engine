import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/tab");

test.describe("Tab", () => {
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
