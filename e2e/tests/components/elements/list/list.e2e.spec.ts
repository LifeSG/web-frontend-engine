import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/list");

test.describe("List", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("basic"),
			},
		});

		test("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
