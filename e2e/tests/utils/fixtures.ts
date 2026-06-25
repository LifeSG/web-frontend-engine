import { type Page, test as base } from "@playwright/test";
import { StoryPage, type TStoryPageOptions } from "./story-page";

export const forComponent = StoryPage.forComponent;

export const test = base.extend<{
	story: StoryPage;
	storyOptions: TStoryPageOptions;
}>({
	storyOptions: async () => {
		throw new Error("storyOptions must be provided via test.use({ storyOptions: ... })");
	},
	story: async ({ page, storyOptions }, use) => {
		const story = new StoryPage(page, storyOptions);
		await use(story);
	},
});

export type TStoryLocatorsFactory<TLocators> = (page: Page) => TLocators;

export type TCreateStoryTestOptions<TLocators> = {
	component: string;
	story: string;
	scope?: TStoryPageOptions["scope"];
	createLocators: TStoryLocatorsFactory<TLocators>;
};

export type TStoryPageWithLocators<TLocators> = StoryPage & {
	locators: TLocators;
};

export const createStoryTest = <TLocators>(options: TCreateStoryTestOptions<TLocators>) => {
	class StoryPageWithLocators extends StoryPage {
		public readonly locators: TLocators;

		public constructor(page: Page) {
			super(page, {
				scope: options.scope,
				component: options.component,
				story: options.story,
			});
			this.locators = options.createLocators(page);
		}
	}

	return test.extend<{ story: StoryPageWithLocators }>({
		story: async ({ page }, runStory) => {
			const story = new StoryPageWithLocators(page);
			await runStory(story);
		},
	});
};

export { expect } from "@playwright/test";
