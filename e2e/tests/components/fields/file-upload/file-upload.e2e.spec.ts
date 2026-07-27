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
			fileItem: (name: string) => page.getByText(name, { exact: true }),
			setCustomErrorsButton: page.getByTestId("set-custom-errors"),
		}),
	});

const uploadInteractionsTest = createFileUploadTest("upload-interactions");
const formStatesTest = createFileUploadTest("form-states");
const thumbnailTest = createFileUploadTest("thumbnail");
const warningTest = createFileUploadTest("warning");
const customErrorTest = createFileUploadTest("custom-error");

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

				await expect(story.locators.fileItem(SAMPLE_PNG_PAYLOAD.name)).toBeVisible();
				await story.snapshot("uploaded-through-button", { locator: story.locators.dropzone });
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
			await expect(story.locators.fileItem("document.pdf")).toBeVisible();
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
				await expect(story.locators.fileItem(SAMPLE_PNG_PAYLOAD.name)).toBeVisible();

				await story.locators.setCustomErrorsButton.click();
				await story.snapshot("main-and-per-file-errors", { locator: story.locators.dropzone });
			});
		});
	});
});
