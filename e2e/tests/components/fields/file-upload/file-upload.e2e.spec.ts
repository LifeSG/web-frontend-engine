import { Page } from "@playwright/test";
import { createStoryTest, expect, test } from "../../../utils/fixtures";
import { createSolidColorPng } from "../../../utils/image-fixtures";

// =============================================================================
// HELPERS
// =============================================================================
const SAMPLE_PNG_PAYLOAD = {
	name: "sample.png",
	mimeType: "image/png",
	buffer: createSolidColorPng(8, 8, 220, 220, 220),
};

const mockUploadAPI = (page: Page) =>
	page.route("**/api/upload", (route) =>
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ success: true }),
		})
	);

const createDataTransfer = (page: Page, file: { name: string; type: string; content: string }) =>
	page.evaluateHandle(({ name, type, content }) => {
		const dt = new DataTransfer();
		dt.items.add(new File([content], name, { type }));
		return dt;
	}, file);

// =============================================================================
// TEST FACTORIES
// =============================================================================
const createFileUploadTest = (story: string) =>
	createStoryTest({
		component: "fields/file-upload",
		story,
		createLocators: (page) => ({
			dropzone: page.getByTestId("file-upload"),
			uploadButton: page.getByRole("button", { name: "Upload files" }),
			dragOverlayText: page.getByText("Drop files here"),
			getFileName: (name: string) => page.getByText(name, { exact: true }),
		}),
	});

const uploadInteractionsTest = createFileUploadTest("upload-interactions");
const formStatesTest = createFileUploadTest("form-states");
const thumbnailTest = createFileUploadTest("thumbnail");
const warningTest = createFileUploadTest("warning");

const customErrorTest = createStoryTest({
	component: "fields/file-upload",
	story: "custom-error",
	createLocators: (page) => ({
		dropzone: page.getByTestId("file-upload"),
		uploadButton: page.getByRole("button", { name: "Upload files" }),
		getFileName: (name: string) => page.getByText(name, { exact: true }),
		setCustomErrorsButton: page.getByTestId("set-custom-errors"),
	}),
});

// =============================================================================
// TESTS
// =============================================================================
test.describe("FileUpload", () => {
	uploadInteractionsTest.describe(() => {
		uploadInteractionsTest("Upload interactions", async ({ story }) => {
			await mockUploadAPI(story.page);
			await story.goto();

			await test.step("Upload through button", async () => {
				const fileChooserPromise = story.page.waitForEvent("filechooser");
				await story.locators.uploadButton.click();
				const fileChooser = await fileChooserPromise;
				await fileChooser.setFiles(SAMPLE_PNG_PAYLOAD);

				await expect(story.locators.getFileName(SAMPLE_PNG_PAYLOAD.name)).toBeVisible();
				await story.snapshot("uploaded-through-button", { locator: story.locators.dropzone });
			});

			await test.step("Upload through drag and drop", async () => {
				// Dispatch dragenter to trigger the overlay UI — this uses the outer container
				// which is where the component listens for drag-enter state changes.
				const dataTransfer = await createDataTransfer(story.page, {
					name: "drag-upload.png",
					type: "image/png",
					content: "drag upload content",
				});
				await story.locators.dropzone.dispatchEvent("dragenter", { dataTransfer });
				await expect(story.locators.dragOverlayText).toBeVisible();
				await story.snapshot("drag-overlay", { locator: story.locators.dropzone });

				// Dismiss the overlay before uploading.
				await story.locators.dropzone.dispatchEvent("dragleave", { dataTransfer });
				await dataTransfer.dispose();

				await story.page.getByTestId("file-upload-input").setInputFiles({
					name: "drag-upload.png",
					mimeType: "image/png",
					buffer: createSolidColorPng(8, 8, 180, 180, 180),
				});

				await expect(story.locators.getFileName("drag-upload.png")).toBeVisible();
				await story.snapshot("uploaded-through-drag-and-drop", { locator: story.locators.dropzone });
			});
		});
	});

	test.describe("Form states", () => {
		formStatesTest.describe(() => {
			formStatesTest("Visual", async ({ story }) => {
				await story.goto();
				await story.snapshot("mount");
			});
		});

		formStatesTest.describe(() => {
			formStatesTest("Mobile", async ({ story }) => {
				await story.setViewport({ size: "mobile" });
				await story.goto();
				await story.snapshot("mount");
			});
		});
	});

	thumbnailTest.describe(() => {
		thumbnailTest("Thumbnail", async ({ story }) => {
			await story.goto();
			await expect(story.locators.getFileName("document.pdf")).toBeVisible();
			await story.snapshot("mount", { locator: story.locators.dropzone });
		});
	});

	warningTest.describe(() => {
		warningTest("Warning", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount", { locator: story.locators.dropzone });
		});
	});

	test.describe("Custom errors", () => {
		customErrorTest.describe(() => {
			customErrorTest("Main field error", async ({ story }) => {
				await story.goto();
				await story.locators.setCustomErrorsButton.click();
				await story.snapshot("main-field-error", { locator: story.locators.dropzone });
			});

			customErrorTest("Main field and per-file errors", async ({ story }) => {
				await mockUploadAPI(story.page);
				await story.goto();

				const fileChooserPromise = story.page.waitForEvent("filechooser");
				await story.locators.uploadButton.click();
				const fileChooser = await fileChooserPromise;
				await fileChooser.setFiles(SAMPLE_PNG_PAYLOAD);
				await expect(story.locators.getFileName(SAMPLE_PNG_PAYLOAD.name)).toBeVisible();

				await story.locators.setCustomErrorsButton.click();
				await story.snapshot("main-and-per-file-errors", { locator: story.locators.dropzone });
			});
		});
	});
});
