import { type Locator, type Page } from "@playwright/test";
import { test as base, expect, forComponent } from "../../../utils/fixtures";
import { compareScreenshot } from "../../../utils/compare-screenshot";
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

	public async snapshot(name: string, options?: { fullscreen?: boolean; locator?: Locator; mask?: Locator[] }) {
		await compareScreenshot(this.page, name, options);
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

		test("renders main label and sublabel", async ({ story }) => {
			await story.goto();
			await expect(story.locators.complexLabel.shownField).toBeVisible();
			await story.snapshot("complex-label-default");
		});

		test("opens hint popover on click", async ({ story }) => {
			await story.goto();

			await test.step("click hint icon to open popover", async () => {
				await story.locators.complexLabel.hintPopover.click();
			});

			await test.step("verify popover content is visible", async () => {
				await expect(story.locators.complexLabel.hintContent).toBeVisible();
			});

			await story.snapshot("complex-label-hint-open");
		});

		test("displays hint popover on mobile", async ({ story }) => {
			await story.setMobileViewport();
			await story.goto();

			await test.step("click hint icon to open popover", async () => {
				await story.locators.complexLabel.hintPopover.click();
			});

			await test.step("verify popover content is visible", async () => {
				await expect(story.locators.complexLabel.hintContentMobile).toBeVisible();
			});

			await story.snapshot("complex-label-hint-open-mobile", { fullscreen: true });
		});
	});

	test.describe("Conditional renderer", () => {
		test.use({
			storyOptions: {
				...withStory("conditional-renderer"),
			},
		});

		test("shows conditional fields when trigger matches", async ({ story }) => {
			await story.goto();
			await expect(story.locators.conditionalRenderer.shownField).toHaveCount(0);
			await expect(story.locators.conditionalRenderer.nestedShownField).toHaveCount(0);

			await story.locators.conditionalRenderer.triggerField.fill("show");

			await expect(story.locators.conditionalRenderer.shownField).toBeVisible();
			await expect(story.locators.conditionalRenderer.nestedShownField).toBeVisible();

			await story.snapshot("conditional-renderer-shown");
		});
	});
});
