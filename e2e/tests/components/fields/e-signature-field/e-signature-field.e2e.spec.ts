import { type Locator, type Page } from "@playwright/test";
import { test as base, expect, forComponent } from "../../../utils/fixtures";
import { StoryPage } from "../../../utils/story-page";

class ESignatureFieldPage extends StoryPage {
	public readonly locators: {
		addSignatureButton: Locator;
		saveButton: Locator;
		signatureModal: Locator;
		canvas: Locator;
		uploadErrorMessage: Locator;
		loadErrorMessage: Locator;
		tryAgainButton: Locator;
		loadRefreshAlert: Locator;
	};

	public constructor(page: Page, story?: string) {
		super(page, { component: "fields/e-signature-field", story });
		this.locators = {
			addSignatureButton: page.getByRole("button", { name: "Add signature" }),
			saveButton: page.getByRole("button", { name: "Save" }),
			signatureModal: page.getByTestId("signature-modal"),
			canvas: page.locator(".upper-canvas"),
			uploadErrorMessage: page.getByText("Signature not uploaded."),
			loadErrorMessage: page.getByText("Failed to load."),
			tryAgainButton: page.getByRole("button", { name: "Please try again." }),
			loadRefreshAlert: page.getByTestId("load-refresh-alert"),
		};
	}

	public async drawSignature() {
		await this.locators.canvas.waitFor({ state: "visible" });
		await this.waitForAnimationEnd(this.locators.signatureModal);
		const box = await this.locators.canvas.boundingBox();
		if (!box) return;
		await this.page.mouse.move(box.x + 50, box.y + 50);
		await this.page.mouse.down();
		await this.page.mouse.move(box.x + 150, box.y + 100, { steps: 5 });
		await this.page.mouse.up();
	}
}

const test = base.extend<{ story: ESignatureFieldPage }>({
	story: async ({ page, storyOptions }, use) => {
		const story = new ESignatureFieldPage(page, storyOptions.story);
		await use(story);
	},
});

const withStory = forComponent("fields/e-signature-field");

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
			await story.goto();
			await story.page.route("**/api/upload", (route) => route.fulfill({ status: 500 }));

			await test.step("Open modal and draw signature", async () => {
				await story.locators.addSignatureButton.click();
				await story.drawSignature();
				await story.locators.saveButton.click();
			});

			await test.step("Verify upload error message appears", async () => {
				await expect(story.locators.uploadErrorMessage).toBeVisible();
				await expect(story.locators.tryAgainButton).toBeVisible();
				await story.snapshot("upload-error");
			});
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("with-default-file-url"),
			},
		});

		test("Load error refresh alert display", async ({ story }) => {
			await story.page.route("**/api/signature-image", (route) => route.fulfill({ status: 500 }));
			await story.goto();

			await test.step("Verify initial load error appears", async () => {
				await expect(story.locators.loadErrorMessage).toBeVisible();
				await expect(story.locators.tryAgainButton).toBeVisible();
			});

			await test.step("Click try again to reach refresh alert threshold", async () => {
				await story.locators.tryAgainButton.click();
				await expect(story.locators.tryAgainButton).toBeVisible();
				await story.locators.tryAgainButton.click();
			});

			await test.step("Verify refresh alert appears after 3 failed load attempts", async () => {
				await expect(story.locators.loadRefreshAlert).toBeVisible();
				await story.snapshot("load-error-refresh-alert");
			});
		});
	});
});
