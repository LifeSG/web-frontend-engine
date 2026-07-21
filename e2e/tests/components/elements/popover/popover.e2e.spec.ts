import { type Locator, type Page } from "@playwright/test";
import { test as base, expect, forComponent } from "../../../utils/fixtures";
import { StoryPage } from "../../../utils/story-page";

class PopoverPage extends StoryPage {
	public readonly locators: {
		hoverPopover: Locator;
	};

	public constructor(page: Page, story?: string) {
		super(page, { component: "elements/popover", story });
		this.locators = {
			hoverPopover: page.getByTestId("popover-hover__popover"),
		};
	}
}

const test = base.extend<{ story: PopoverPage }>({
	story: async ({ page, storyOptions }, use) => {
		const story = new PopoverPage(page, storyOptions.story);
		await use(story);
	},
});

const withStory = forComponent("elements/popover");

test.describe("Popover", () => {
	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("default"),
			},
		});

		test("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("hover"),
			},
		});

		test("Hover", async ({ story }) => {
			await story.goto();

			await story.locators.hoverPopover.hover();
			expect(story.locators.hoverPopover).toBeVisible();
			await story.snapshot("open", { fullscreen: true });
		});
	});
});
