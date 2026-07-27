import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/slider");

test.describe("Slider", () => {
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
				...withStory("drag"),
			},
		});

		test("Drag", async ({ story }) => {
			await story.goto();

			const thumb = story.page.getByRole("slider");
			const track = story.page.getByTestId("field__slider");

			const trackBox = await track.boundingBox();
			const thumbBox = await thumb.boundingBox();

			const startX = thumbBox.x + thumbBox.width / 2;
			const startY = thumbBox.y + thumbBox.height / 2;
			const targetX = trackBox.x + trackBox.width * 0.25;

			await story.page.mouse.move(startX, startY);
			await story.page.mouse.down();
			await story.page.mouse.move(targetX, startY, { steps: 10 });
			await story.page.mouse.up();

			await story.snapshot("dragged");
		});
	});
});
