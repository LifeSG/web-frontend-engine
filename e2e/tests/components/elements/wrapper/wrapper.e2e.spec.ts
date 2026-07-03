import { type Locator, type Page } from "@playwright/test";
import { test as base, expect, forComponent } from "../../../utils/fixtures";
import { StoryPage } from "../../../utils/story-page";

class WrapperPage extends StoryPage {
	public readonly locators: {
		complexLabel: {
			hintPopover: Locator;
			hintContent: Locator;
			hintContentMobile: Locator;
			shownField: Locator;
		};
		conditionalRenderer: {
			triggerField: Locator;
			shownField: Locator;
			nestedShownField: Locator;
		};
	};

	public constructor(page: Page, story?: string) {
		super(page, { component: "elements/wrapper", story });
		this.locators = {
			complexLabel: {
				hintPopover: page.getByTestId("field1-popover"),
				hintContent: page.getByTestId("card").getByText("Please enter your full legal name"),
				hintContentMobile: page.getByTestId("modal-content").getByText("Please enter your full legal name"),
				shownField: page.getByTestId("field1__text-field-base"),
			},
			conditionalRenderer: {
				triggerField: page.getByRole("textbox", { name: "Trigger field" }),
				shownField: page.getByTestId("shownField__text-field-base"),
				nestedShownField: page.getByTestId("nestedShownField__text-field-base"),
			},
		};
	}

	public async setMobileViewport() {
		await this.page.setViewportSize({ width: 375, height: 667 });
	}

	public async setDesktopViewport() {
		await this.page.setViewportSize({ width: 1280, height: 720 });
	}
}

const test = base.extend<{ story: WrapperPage }>({
	story: async ({ page, storyOptions }, use) => {
		const story = new WrapperPage(page, storyOptions.story);
		await use(story);
	},
});

const withStory = forComponent("elements/wrapper");

test.describe("Wrapper", () => {
	test.describe("Column layout", () => {
		test.use({
			storyOptions: {
				...withStory("column-layout"),
			},
		});

		test("Desktop", async ({ story }) => {
			await story.setDesktopViewport();
			await story.goto();

			await story.snapshot("mount");
		});

		test("Mobile", async ({ story }) => {
			await story.setMobileViewport();
			await story.goto();

			await story.snapshot("mount");
		});
	});

	test.describe("Complex label", () => {
		test.use({
			storyOptions: {
				...withStory("complex-label"),
			},
		});

		test("Main label and sublabel", async ({ story }) => {
			await story.goto();

			await expect(story.locators.complexLabel.shownField).toBeVisible();
			await story.snapshot("mount");
		});

		test("Hint display", async ({ story }) => {
			await story.goto();

			await test.step("Open popover", async () => {
				await story.locators.complexLabel.hintPopover.click();
			});

			await test.step("Verify popover is visible", async () => {
				await expect(story.locators.complexLabel.hintContent).toBeVisible();
				await story.snapshot("hint-open");
			});
		});

		test("Hint display (mobile)", async ({ story }) => {
			await story.setMobileViewport();
			await story.goto();

			await test.step("Open popover", async () => {
				await story.locators.complexLabel.hintPopover.click();
			});

			await test.step("Verify popover is visible", async () => {
				await expect(story.locators.complexLabel.hintContentMobile).toBeVisible();
				await story.snapshot("hint-open", { fullscreen: true });
			});
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("conditional-renderer"),
			},
		});

		test("Conditional rendering", async ({ story }) => {
			await story.goto();

			await expect(story.locators.conditionalRenderer.shownField).not.toBeVisible();
			await expect(story.locators.conditionalRenderer.nestedShownField).not.toBeVisible();
			await story.snapshot("hidden");

			await story.locators.conditionalRenderer.triggerField.fill("show");

			await expect(story.locators.conditionalRenderer.shownField).toBeVisible();
			await expect(story.locators.conditionalRenderer.nestedShownField).toBeVisible();
			await story.snapshot("shown");
		});
	});
});
