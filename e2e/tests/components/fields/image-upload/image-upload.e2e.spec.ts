import { forComponent, test } from "../../../utils/fixtures";
import { viewport } from "../../../consts";

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

/**
 * Waits until the fabric.js image editor canvas has been initialised and
 * laid out with non-zero dimensions, meaning the background image has been
 * rendered onto the canvas.
 */
async function waitForImageEditorCanvas(page: import("@playwright/test").Page) {
	await page.waitForFunction(() => {
		const canvas = document.getElementById("imageEditor");
		return !!canvas && canvas.getBoundingClientRect().height > 0;
	});
}

/**
 * Uploads the two test files on mobile — skips the "Review photos?" prompt
 * because isMobileView() opens the review modal directly without a prompt.
 */
async function uploadFilesForMobileReview(page: import("@playwright/test").Page) {
	const fileInput = page.getByTestId("field-drag-upload__hidden-input");
	await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
	// On mobile the modal opens directly (no "Ok" prompt)
	await page.getByTestId("field__draw-button").waitFor({ state: "visible" });
	await waitForImageEditorCanvas(page);
}

test.describe("ImageUpload", () => {
	test.describe(() => {
		test.use({ storyOptions: withStory("default") });

		test("Default render", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});

		test("Default render (mobile)", async ({ story }) => {
			await story.goto();
			await story.page.setViewportSize(viewport.mobile);
			await story.snapshot("mount");
		});
	});

	test.describe("Edit image", () => {
		test.describe.configure({ mode: "serial" });
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
					fullscreen: true,
				});
			});

			await test.step("Save and return to upload view", async () => {
				await story.page.getByTestId("field__save-button").click();
				await story.snapshot("uploaded-files");
			});
		});

		test("Review modal (mobile)", async ({ story }) => {
			await story.goto();
			await story.page.setViewportSize(viewport.mobile);

			await test.step("Upload short and long filename files", async () => {
				const fileInput = story.page.getByTestId("field-drag-upload__hidden-input");
				await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
			});

			await test.step("Wait for review modal to open and snapshot", async () => {
				await story.page.getByTestId("field__draw-button").waitFor({ state: "visible" });
				await waitForImageEditorCanvas(story.page);
				await story.snapshot("review-modal", {
					fullscreen: true,
				});
			});

			await test.step("Save and return to upload view", async () => {
				await story.page.getByTestId("field__save-button").click();
				await story.snapshot("uploaded-files");
			});
		});

		test("Review modal (mobile landscape)", async ({ story }) => {
			await story.goto();
			await story.page.setViewportSize(viewport.mobileLandscape);

			await test.step("Upload short and long filename files", async () => {
				const fileInput = story.page.getByTestId("field-drag-upload__hidden-input");
				await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
			});

			await test.step("Wait for review modal to open and snapshot", async () => {
				await story.page.getByTestId("field__draw-button").waitFor({ state: "visible" });
				await waitForImageEditorCanvas(story.page);
				await story.snapshot("review-modal", {
					fullscreen: true,
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
				fullscreen: true,
			});
		});

		test("Drawing tools (mobile)", async ({ story }) => {
			await story.goto();
			await story.page.setViewportSize(viewport.mobile);
			await uploadFilesForMobileReview(story.page);
			await story.page.getByTestId("field__draw-button").click();
			await story.snapshot("draw-mode", {
				fullscreen: true,
			});
		});

		test("Drawing tools (mobile landscape)", async ({ story }) => {
			await story.goto();
			await story.page.setViewportSize(viewport.mobileLandscape);
			await uploadFilesForMobileReview(story.page);
			await story.page.getByTestId("field__draw-button").click();
			await story.snapshot("draw-mode", {
				fullscreen: true,
			});
		});
	});
});
