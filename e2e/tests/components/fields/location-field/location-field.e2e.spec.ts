import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/location-field");

test.describe("Location Field", () => {
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
				...withStory("warning"),
			},
		});

		test("Warning", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("map"),
			},
		});

		test("Map", async ({ story }) => {
			await story.goto();
			await story.page.waitForLoadState("networkidle");
			await story.snapshot("mount");
		});
	});
});
