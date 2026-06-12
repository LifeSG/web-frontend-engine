import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("elements/divider");

test.describe("Divider", () => {
	test.describe("Default", () => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Mount", async ({ story }) => {
			await story.goto();
			await story.snapshot(`state`);
		});
	});

	// TODO: Remove this example when we add a proper test for the component.
	test.describe("Story A", () => {
		test.use({
			storyOptions: {
				...withStory("story-a"),
			},
		});

		test("Mount", async ({ story }) => {
			await story.goto();
			await story.snapshot(`state`);
		});
	});
});
