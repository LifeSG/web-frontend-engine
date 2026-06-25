import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/text-field");

test.describe("Text Field", () => {
	test.describe("Warning", () => {
		test.use({
			storyOptions: {
				...withStory("warning"),
			},
		});

		test("state", async ({ story }) => {
			await story.goto();
			await story.snapshot("warning");
		});
	});
});
