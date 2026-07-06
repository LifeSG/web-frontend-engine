import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("custom/review");

test.describe("Review", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default-box"),
			},
		});

		test("Box Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("default");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default-accordion"),
			},
		});

		test("Accordion Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("default");
		});
	});
});
