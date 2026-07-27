import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/masked-field");

test.describe("MaskedField", () => {
	test.describe.configure({ mode: "serial" });

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
				...withStory("disabled"),
			},
		});

		test("Disabled state", async ({ story }) => {
			await story.goto();
			await story.snapshot("disabled");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("warning"),
			},
		});

		test("Warning state", async ({ story }) => {
			await story.goto();
			await story.snapshot("warning");
		});
	});
});
