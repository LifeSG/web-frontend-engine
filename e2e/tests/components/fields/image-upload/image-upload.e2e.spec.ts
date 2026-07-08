import { forComponent, test } from "../../../utils/fixtures";

const withStory = forComponent("fields/image-upload");

// Minimal valid 1×1 PNG — used as stand-in upload files.
const MINIMAL_PNG_BUFFER = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
	"base64"
);

const SHORT_FILE = { name: "a.png", mimeType: "image/png", buffer: MINIMAL_PNG_BUFFER };
const LONG_FILE = {
	name: "this-is-a-very-long-filename-that-exceeds-the-width-of-the-file-upload-display-area.png",
	mimeType: "image/png",
	buffer: MINIMAL_PNG_BUFFER,
};

/**
 * Uploads the two test files via the hidden drag-upload input and waits for
 * the "Review photos?" prompt to appear (desktop flow with editImage: true).
 */
async function uploadFilesAndConfirmReview(page: import("@playwright/test").Page) {
	const fileInput = page.getByTestId("field-drag-upload__hidden-input");
	await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
	await page.getByRole("button", { name: "Ok" }).click();
}

test.describe("ImageUpload", () => {
	test.describe(() => {
		test.use({ storyOptions: withStory("default") });

		test("Default render", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe("Edit image", () => {
		test.use({ storyOptions: withStory("edit-image") });

		test("Review modal", async ({ story }) => {
			await story.goto();

			await test.step("Upload short and long filename files", async () => {
				const fileInput = story.page.getByTestId("field-drag-upload__hidden-input");
				await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
			});

			await test.step("Confirm review prompt and open modal", async () => {
				await story.page.getByRole("button", { name: "Ok" }).click();
				await story.snapshot("review-modal", {
					locator: story.page.getByTestId("modal-box"),
				});
			});

			await test.step("Save and return to upload view", async () => {
				await story.page.getByTestId("field__save-button").click();
				await story.snapshot("uploaded-files");
			});
		});

		test("Drawing tools", async ({ story }) => {
			await story.goto();
			await uploadFilesAndConfirmReview(story.page);
			await story.page.getByTestId("field__draw-button").click();
			await story.snapshot("draw-mode", {
				locator: story.page.getByTestId("modal-box"),
			});
		});
	});
});
