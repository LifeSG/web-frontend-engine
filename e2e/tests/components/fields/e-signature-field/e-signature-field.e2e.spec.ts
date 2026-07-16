import { expect, forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/e-signature-field");

const drawSignature = async (page: Parameters<Parameters<typeof test>[1]>[0]["page"]) => {
	const canvas = page.locator(".upper-canvas");
	const box = await canvas.boundingBox();
	await page.mouse.move(box.x + 50, box.y + 50);
	await page.mouse.down();
	await page.mouse.move(box.x + 150, box.y + 100, { steps: 5 });
	await page.mouse.up();
};

test.describe("E-Signature Field", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Default rendering", async ({ story }) => {
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

		test("Warning display", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("with-upload"),
			},
		});

		test("Upload error display", async ({ story }) => {
			await story.page.route("**/api/upload", (route) => route.fulfill({ status: 500 }));
			await story.goto();

			await test.step("Open modal and draw signature", async () => {
				await story.page.getByRole("button", { name: "Add signature" }).click();
				await drawSignature(story.page);
				await story.page.getByRole("button", { name: "Save" }).click();
			});

			await test.step("Verify upload error message appears", async () => {
				await expect(story.page.getByText("Signature not uploaded.")).toBeVisible();
				await expect(story.page.getByRole("button", { name: "Please try again." })).toBeVisible();
				await story.snapshot("upload-error");
			});
		});
	});
});
