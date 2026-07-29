import { forComponent, test } from "../../../utils/fixtures";
import { createSolidColorPng } from "../../../utils/image-fixtures";

const withStory = forComponent("fields/radio-button");

test.describe("Radio Button", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("default");
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

test.describe("Radio Toggle Button", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-default"),
			},
		});

		test("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("toggle-default");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-vertical"),
			},
		});

		test("Vertical layout", async ({ story }) => {
			await story.goto();
			await story.snapshot("toggle-vertical");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-overflow"),
			},
		});

		test("Overflow", async ({ story }) => {
			await story.goto();
			await story.snapshot("toggle-overflow");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("toggle-nested"),
			},
		});

		test("Nested fields", async ({ story }) => {
			await story.goto();
			await story.snapshot("toggle-nested");
		});
	});
});

test.describe("Radio Image Button", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("image-button-default"),
			},
		});

		test("Default", async ({ story }) => {
			await story.page.route("/image/*/*/*.png", async (route) => {
				const url = new URL(route.request().url());
				const [x, y, zVal] = url.pathname.split("/").slice(-3);
				const z = zVal.split(".")[0];

				const r = Number(z) % 256;
				const g = Number(x) % 256;
				const b = Number(y) % 256;
				const image = createSolidColorPng(256, 192, r, g, b);

				await route.fulfill({
					status: 200,
					contentType: "image/png",
					body: image,
				});
			});

			await story.goto();
			await story.snapshot("image-button-default");
		});
	});
});
