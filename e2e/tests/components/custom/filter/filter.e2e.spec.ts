import { expect, forComponent, test } from "../../../utils/fixtures";

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

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("with-text-content"),
			},
		});

		test("Plain text content", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("with-filter-checkbox"),
			},
		});

		test("Filter checkbox", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("with-tooltip"),
			},
		});

		test("Filter title with tooltip", async ({ story }) => {
			await story.goto();

			await test.step("Renders tooltip icon in filter title", async () => {
				await expect(story.page.getByTestId("filterItem-popover")).toBeVisible();
				await story.snapshot("mount");
			});

			await test.step("Shows popover content on click", async () => {
				await story.page.getByTestId("filterItem-popover").click();
				await story.snapshot("popover-open");
			});
		});
	});
});
