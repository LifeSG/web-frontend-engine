import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/accordion");

test.describe("Accordion", () => {
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

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("collapsed"),
			},
		});

		test("Collapsed", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
