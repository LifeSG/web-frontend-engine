import { test as base } from "@playwright/test";
import { StoryPage, type TStoryPageOptions } from "./story-page";

export const forComponent = StoryPage.forComponent;

export const test = base.extend<{
	story: StoryPage;
	storyOptions: TStoryPageOptions;
}>({
	storyOptions: [{ component: "elements/divider", story: "default" }, { option: true }],
	story: async ({ page, storyOptions }, use) => {
		const story = new StoryPage(page, storyOptions);
		await use(story);
	},
});

export { expect } from "@playwright/test";
