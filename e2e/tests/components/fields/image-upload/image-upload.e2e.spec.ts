import { deflateSync } from "zlib";
import { forComponent, test } from "../../../utils/fixtures";
import { viewport } from "../../../consts";

const withStory = forComponent("fields/image-upload");

// =============================================================================
// PNG GENERATION HELPERS
// Used to produce a visible solid-colour PNG instead of a 1×1 pixel stand-in
// so that the blue drawn circle is clearly distinguishable from the backdrop.
// =============================================================================
const CRC32_TABLE = (() => {
	const t: number[] = [];
	for (let i = 0; i < 256; i++) {
		let c = i;
		for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[i] = c;
	}
	return t;
})();

function crc32(buf: Buffer): number {
	let crc = 0xffffffff;
	for (let i = 0; i < buf.length; i++) crc = CRC32_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
	const typeBytes = Buffer.from(type, "ascii");
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
	return Buffer.concat([len, typeBytes, data, crc]);
}

/** Returns a valid PNG buffer filled with a single solid RGB colour. */
function createSolidColorPng(width: number, height: number, r: number, g: number, b: number): Buffer {
	// Build one row: [filter=None, R, G, B, R, G, B, ...]
	const row = Buffer.alloc(1 + width * 3);
	for (let x = 0; x < width; x++) {
		row[1 + x * 3] = r;
		row[2 + x * 3] = g;
		row[3 + x * 3] = b;
	}
	// Repeat for all rows, then zlib-compress for IDAT
	const raw = Buffer.concat(Array.from({ length: height }, () => row));

	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr.writeUInt8(8, 8); // bit depth
	ihdr.writeUInt8(2, 9); // color type: RGB

	return Buffer.concat([
		Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
		pngChunk("IHDR", ihdr),
		pngChunk("IDAT", deflateSync(raw)),
		pngChunk("IEND", Buffer.alloc(0)),
	]);
}

// Light-gray 200×200 PNG — large enough that fabric.js renders it as a visible
// backdrop, so the blue drawn circle is clearly separated from the background.
const IMAGE_BUFFER = createSolidColorPng(200, 200, 220, 220, 220);

const SHORT_FILE = { name: "a.png", mimeType: "image/png", buffer: IMAGE_BUFFER };
const LONG_FILE = {
	name: "this-is-a-very-long-filename-that-exceeds-the-width-of-the-file-upload-display-area.png",
	mimeType: "image/png",
	buffer: IMAGE_BUFFER,
};
// A third distinct file used when tests need to exceed a 2-file max limit
const THIRD_FILE = { name: "c.png", mimeType: "image/png", buffer: IMAGE_BUFFER };

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

// The playwright.config.ts has fullyParallel: true, which would let tests run
// concurrently and crash the Docker browser under resource pressure. Serial mode
// limits concurrency for this file while keeping each test fully isolated
// (each test still gets its own fresh page via Playwright's page fixture).
test.describe("ImageUpload", () => {
	test.describe.configure({ mode: "serial" });

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

	test.describe("Drag and drop", () => {
		test.use({ storyOptions: withStory("default") });

		test("Drag and drop hint", async ({ story }) => {
			await story.goto();

			// Simulate a file drag entering the dropzone to trigger isDragActive = true
			const dropzone = story.page.getByTestId("field-drag-upload");
			const dataTransfer = await story.page.evaluateHandle(() => {
				const dt = new DataTransfer();
				dt.items.add(new File([""], "test.png", { type: "image/png" }));
				return dt;
			});
			await dropzone.dispatchEvent("dragenter", { dataTransfer });
			await story.page.getByTestId("field-drag-upload__hint").waitFor({ state: "visible" });

			await story.snapshot("drag-active");
		});
	});

	test.describe("Edit image", () => {
		test.use({ storyOptions: withStory("edit-image") });

		test.afterEach(async ({ page }) => {
			// Navigate away from the canvas-heavy page after each test so the browser
			// can release fabric.js/canvas/WebGL resources before the next test loads
			// another instance of the same page. Without this, cumulative memory
			// pressure in Docker causes "Page crashed" after several tests.
			await page.goto("about:blank");
		});

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

		test("Drawing on canvas", async ({ story }) => {
			await story.goto();

			await test.step("Upload files and open review modal", async () => {
				const fileInput = story.page.getByTestId("field-drag-upload__hidden-input");
				await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
				await story.page.getByRole("button", { name: "Ok" }).click();
				await waitForImageEditorCanvas(story.page);
			});

			await test.step("Enter draw mode, select colour and draw a circle", async () => {
				await story.page.getByTestId("field__draw-button").click();

				// Select a visible colour from the palette (default black is invisible on dark canvas)
				await story.page.getByRole("button", { name: "blue brush" }).click();

				// Fabric.js intercepts events via its upper-canvas overlay which
				// shares the same bounding box as the main canvas element.
				const canvas = story.page.locator("#imageEditor");
				const box = await canvas.boundingBox();

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
				await story.page.getByTestId("field__save-drawing").click();
				await waitForImageEditorCanvas(story.page);
				await story.snapshot("drawing-saved", { fullscreen: true });
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

		test("Delete confirmation prompt", async ({ story }) => {
			await story.goto();

			await test.step("Upload files and open review modal", async () => {
				const fileInput = story.page.getByTestId("field-drag-upload__hidden-input");
				await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
				await story.page.getByRole("button", { name: "Ok" }).click();
				await waitForImageEditorCanvas(story.page);
			});

			await test.step("Trigger and snapshot delete prompt", async () => {
				await story.page.getByTestId("field__delete-button").click();
				await story.page.getByText("Delete photo?").waitFor({ state: "visible" });
				await story.snapshot("delete-prompt", { fullscreen: true });
			});
		});

		test("Exit confirmation prompt", async ({ story }) => {
			await story.goto();

			await test.step("Upload files and open review modal", async () => {
				const fileInput = story.page.getByTestId("field-drag-upload__hidden-input");
				await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
				await story.page.getByRole("button", { name: "Ok" }).click();
				await waitForImageEditorCanvas(story.page);
			});

			await test.step("Trigger and snapshot exit prompt", async () => {
				await story.page.getByTestId("field__close-button").click();
				await story.page.getByText("Exit without saving?").waitFor({ state: "visible" });
				await story.snapshot("exit-prompt", { fullscreen: true });
			});
		});

		test("Clear drawing confirmation prompt", async ({ story }) => {
			await story.goto();

			await test.step("Upload files and open review modal", async () => {
				const fileInput = story.page.getByTestId("field-drag-upload__hidden-input");
				await fileInput.setInputFiles([SHORT_FILE, LONG_FILE]);
				await story.page.getByRole("button", { name: "Ok" }).click();
				await waitForImageEditorCanvas(story.page);
			});

			await test.step("Enter draw mode and trigger clear prompt", async () => {
				await story.page.getByTestId("field__draw-button").click();
				await story.page.getByTestId("field__clear-drawing-button").click();
				await story.page.getByText("Clear drawings?").waitFor({ state: "visible" });
				await story.snapshot("clear-drawing-prompt", { fullscreen: true });
			});
		});
	});

	test.describe("Max files", () => {
		test.use({ storyOptions: withStory("max-files") });

		test("Max files exceeded", async ({ story }) => {
			await story.goto();

			const fileInput = story.page.getByTestId("field-drag-upload__hidden-input");
			// Upload 3 files when max is 2 — triggers the exceeded-files error alert
			await fileInput.setInputFiles([SHORT_FILE, LONG_FILE, THIRD_FILE]);
			await story.page.getByTestId("field__error").waitFor({ state: "visible" });

			await story.snapshot("max-files-exceeded");
		});
	});
});
