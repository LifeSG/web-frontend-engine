import { type Locator, type Page, expect } from "@playwright/test";
import { test as base, forComponent } from "../../../utils/fixtures";
import { viewport } from "../../../consts";
import { createSolidColorPng } from "../../../utils/image-fixtures";

// =============================================================================
// IMAGE FILE FIXTURES
// Light-gray 200×200 PNG — large enough that fabric.js renders it as a visible
// backdrop, so drawn strokes are clearly separated from the background.
// =============================================================================
const IMAGE_BUFFER = createSolidColorPng(200, 200, 220, 220, 220);
const SHORT_FILE = { name: "a.png", mimeType: "image/png", buffer: IMAGE_BUFFER };
const LONG_FILE = {
	name: "this-is-a-very-long-filename-that-exceeds-the-width-of-the-file-upload-display-area.png",
	mimeType: "image/png",
	buffer: IMAGE_BUFFER,
};
// A third distinct file used when tests need to exceed a per-field max-files limit
const THIRD_FILE = { name: "c.png", mimeType: "image/png", buffer: IMAGE_BUFFER };
import { StoryPage } from "../../../utils/story-page";

const withStory = forComponent("fields/image-upload");

// =============================================================================
// CUSTOM STORY PAGE
// Centralises all locators and upload/canvas helper methods so test bodies stay
// declarative and free of repeated getByTestId calls.
// =============================================================================
class ImageUploadPage extends StoryPage {
	public readonly locators: {
		// Upload form
		fileInput: Locator;
		errorAlert: Locator;
		// Drag and drop
		dropzone: Locator;
		dragHint: Locator;
		// Review modal
		reviewOkButton: Locator;
		drawButton: Locator;
		deleteButton: Locator;
		closeButton: Locator;
		saveButton: Locator;
		// Draw mode
		saveDrawingButton: Locator;
		clearDrawingButton: Locator;
		blueBrush: Locator;
		// Canvas
		imageEditor: Locator;
		// Upload form (add)
		addButton: Locator;
	};

	public constructor(page: Page, story?: string) {
		super(page, { component: "fields/image-upload", story });
		this.locators = {
			fileInput: page.getByTestId("field-drag-upload__hidden-input"),
			errorAlert: page.getByTestId("field__error"),
			dropzone: page.getByTestId("field-drag-upload"),
			dragHint: page.getByTestId("field-drag-upload__hint"),
			reviewOkButton: page.getByRole("button", { name: "Ok" }),
			drawButton: page.getByTestId("field__draw-button"),
			deleteButton: page.getByTestId("field__delete-button"),
			closeButton: page.getByTestId("field__close-button"),
			saveButton: page.getByTestId("field__save-button"),
			saveDrawingButton: page.getByTestId("field__save-drawing"),
			clearDrawingButton: page.getByTestId("field__clear-drawing-button"),
			blueBrush: page.getByRole("button", { name: "blue brush" }),
			imageEditor: page.locator("#imageEditor"),
			addButton: page.getByTestId("field__file-input-add-button"),
		};
	}

	/** Sets files on the hidden drag-upload input. Defaults to [SHORT_FILE, LONG_FILE]. */
	public async uploadFiles(files: { name: string; mimeType: string; buffer: Buffer }[] = [SHORT_FILE, LONG_FILE]) {
		await this.locators.fileInput.setInputFiles(files);
	}

	/** Waits until the fabric.js canvas has non-zero dimensions (image rendered). */
	public async waitForImageEditorCanvas() {
		await this.page.waitForFunction(() => {
			const canvas = document.getElementById("imageEditor");
			return !!canvas && canvas.getBoundingClientRect().height > 0;
		});
	}

	/** Desktop flow: upload files and confirm the "Review photos?" prompt. */
	public async uploadFilesAndConfirmReview() {
		await this.uploadFiles();
		await this.locators.reviewOkButton.click();
	}

	/**
	 * Mobile flow: upload files without a prompt — isMobileView() opens the review
	 * modal directly, then waits for the canvas to be fully initialised.
	 */
	public async uploadFilesForMobileReview() {
		await this.uploadFiles();
		await this.locators.drawButton.waitFor({ state: "visible" });
		await this.waitForImageEditorCanvas();
	}
}

const test = base.extend<{ story: ImageUploadPage }>({
	story: async ({ page, storyOptions }, use) => {
		const story = new ImageUploadPage(page, storyOptions.story);
		await use(story);
	},
});

test.describe("ImageUpload", () => {
	test.describe(() => {
		test.use({ storyOptions: withStory("default") });

		test("Default render", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});

		test("Default render (mobile)", async ({ story }) => {
			await story.page.setViewportSize(viewport.mobile);
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({ storyOptions: withStory("default") });

		test("Drag and drop", async ({ story }) => {
			await story.goto();

			// Simulate a file drag entering the dropzone to trigger isDragActive = true
			const dataTransfer = await story.page.evaluateHandle(() => {
				const dt = new DataTransfer();
				dt.items.add(new File([""], "test.png", { type: "image/png" }));
				return dt;
			});
			await story.locators.dropzone.dispatchEvent("dragenter", { dataTransfer });

			await expect(story.locators.dragHint).toBeVisible();

			await story.waitForImageLoad();
			await story.snapshot("drag-active");
		});
	});

	test.describe("Edit image", () => {
		test.use({ storyOptions: withStory("edit-image") });

		test("Review modal", async ({ story }) => {
			await story.goto();

			await test.step("Upload short and long filename files", async () => {
				await story.uploadFiles();
			});

			await test.step("Confirm review prompt and open modal", async () => {
				await story.locators.reviewOkButton.click();
				await story.snapshot("review-modal", {
					fullscreen: true,
				});
			});

			await test.step("Save and return to upload view", async () => {
				await story.locators.saveButton.click();
				await story.snapshot("uploaded-files");
			});
		});

		test("Review modal (mobile)", async ({ story }) => {
			await story.page.setViewportSize(viewport.mobile);
			await story.goto();

			await test.step("Upload short and long filename files", async () => {
				await story.uploadFiles();
			});

			await test.step("Wait for review modal to open and snapshot", async () => {
				await story.locators.drawButton.waitFor({ state: "visible" });
				await story.waitForImageEditorCanvas();
				await story.snapshot("review-modal", {
					fullscreen: true,
				});
			});

			await test.step("Save and return to upload view", async () => {
				await story.locators.saveButton.click();
				await story.snapshot("uploaded-files");
			});
		});

		test("Review modal (mobile landscape)", async ({ story }) => {
			await story.page.setViewportSize(viewport.mobileLandscape);
			await story.goto();

			await test.step("Upload short and long filename files", async () => {
				await story.uploadFiles();
			});

			await test.step("Wait for review modal to open and snapshot", async () => {
				await story.locators.drawButton.waitFor({ state: "visible" });
				await story.waitForImageEditorCanvas();
				await story.snapshot("review-modal", {
					fullscreen: true,
				});
			});

			await test.step("Save and return to upload view", async () => {
				await story.locators.saveButton.click();
				await story.snapshot("uploaded-files");
			});
		});

		test("Drawing tools", async ({ story }) => {
			await story.goto();
			await story.uploadFilesAndConfirmReview();
			await story.locators.drawButton.click();
			await story.snapshot("draw-mode", {
				fullscreen: true,
			});
		});

		test("Drawing on canvas", async ({ story }) => {
			await story.goto();

			await test.step("Upload files and open review modal", async () => {
				await story.uploadFiles();
				await story.locators.reviewOkButton.click();
				await story.waitForImageEditorCanvas();
			});

			await test.step("Enter draw mode, select colour and draw a circle", async () => {
				await story.locators.drawButton.click();

				// Select a visible colour from the palette (default black is invisible on dark canvas)
				await story.locators.blueBrush.click();

				// Fabric.js intercepts events via its upper-canvas overlay which
				// shares the same bounding box as the main canvas element.
				const box = await story.locators.imageEditor.boundingBox();

				// Draw a square by tracing its four sides.
				// Only the outline is drawn — the image remains visible inside and outside.
				const margin = 0.25;
				const x0 = box.x + box.width * margin;
				const y0 = box.y + box.height * margin;
				const x1 = box.x + box.width * (1 - margin);
				const y1 = box.y + box.height * (1 - margin);

				await story.page.mouse.move(x0, y0); // top-left
				await story.page.mouse.down();
				await story.page.mouse.move(x1, y0, { steps: 10 }); // → top-right
				await story.page.mouse.move(x1, y1, { steps: 10 }); // ↓ bottom-right
				await story.page.mouse.move(x0, y1, { steps: 10 }); // ← bottom-left
				await story.page.mouse.move(x0, y0, { steps: 10 }); // ↑ back to top-left
				await story.page.mouse.up();

				await story.snapshot("drawing", { fullscreen: true });
			});

			await test.step("Save drawing and return to review modal", async () => {
				await story.locators.saveDrawingButton.click();
				await story.waitForImageEditorCanvas();
				await story.snapshot("drawing-saved", { fullscreen: true });
			});

			await test.step("Save from review modal and snapshot uploaded files with updated thumbnail", async () => {
				await story.locators.saveButton.click();
				await story.snapshot("uploaded-with-drawing");
			});
		});

		test("Drawing tools (mobile)", async ({ story }) => {
			await story.page.setViewportSize(viewport.mobile);
			await story.goto();
			await story.uploadFilesForMobileReview();
			await story.locators.drawButton.click();
			await story.snapshot("draw-mode", {
				fullscreen: true,
			});
		});

		test("Drawing tools (mobile landscape)", async ({ story }) => {
			await story.page.setViewportSize(viewport.mobileLandscape);
			await story.goto();
			await story.uploadFilesForMobileReview();
			await story.locators.drawButton.click();
			await story.snapshot("draw-mode", {
				fullscreen: true,
			});
		});

		test("Delete confirmation prompt", async ({ story }) => {
			await story.goto();

			await test.step("Upload files and open review modal", async () => {
				await story.uploadFiles();
				await story.locators.reviewOkButton.click();
				await story.waitForImageEditorCanvas();
			});

			await test.step("Trigger and snapshot delete prompt", async () => {
				await story.locators.deleteButton.click();
				await story.page.getByText("Delete photo?").waitFor({ state: "visible" });
				await story.snapshot("delete-prompt", { fullscreen: true });
			});
		});

		test("Exit confirmation prompt", async ({ story }) => {
			await story.goto();

			await test.step("Upload files and open review modal", async () => {
				await story.uploadFiles();
				await story.locators.reviewOkButton.click();
				await story.waitForImageEditorCanvas();
			});

			await test.step("Trigger and snapshot exit prompt", async () => {
				await story.locators.closeButton.click();
				await story.page.getByText("Exit without saving?").waitFor({ state: "visible" });
				await story.snapshot("exit-prompt", { fullscreen: true });
			});
		});

		test("Clear drawing confirmation prompt", async ({ story }) => {
			await story.goto();

			await test.step("Upload files and open review modal", async () => {
				await story.uploadFiles();
				await story.locators.reviewOkButton.click();
				await story.waitForImageEditorCanvas();
			});

			await test.step("Enter draw mode and trigger clear prompt", async () => {
				await story.locators.drawButton.click();
				await story.locators.clearDrawingButton.click();
				await story.page.getByText("Clear drawings?").waitFor({ state: "visible" });
				await story.snapshot("clear-drawing-prompt", { fullscreen: true });
			});
		});
	});

	test.describe("Max files", () => {
		test.use({ storyOptions: withStory("max-files") });

		test("Max files", async ({ story }) => {
			await story.goto();

			// Upload exactly 2 files (the max) — the add button should no longer be visible
			await story.uploadFiles();
			await expect(story.locators.addButton).not.toBeVisible();

			await story.snapshot("max-files-reached");
		});

		test("Max files exceeded", async ({ story }) => {
			await story.goto();

			// Upload 3 files when max is 2 — triggers the exceeded-files error alert
			await story.uploadFiles([SHORT_FILE, LONG_FILE, THIRD_FILE]);
			await expect(story.locators.errorAlert).toBeVisible();

			await story.snapshot("max-files-exceeded");
		});
	});
});
