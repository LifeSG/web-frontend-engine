import { type Page } from "@playwright/test";
import { AbstractStoryPage, TAbstractStoryPageOptions, type TStoryScope } from "./abstract-story-page";

export type TStoryPageOptions = {
	scope?: TStoryScope;
	component: string;
	story?: string;
	useMockedTimestamp?: TAbstractStoryPageOptions["useMockedTimestamp"];
	viewport?: TAbstractStoryPageOptions["viewport"];
};

export type TStoryOptionsFactory = (story: string) => TStoryPageOptions;

export class StoryPage extends AbstractStoryPage {
	protected readonly scope: TStoryScope;
	protected readonly component: string;
	protected readonly story: string;

	public static forComponent(component: string, scope: TStoryScope = "components"): TStoryOptionsFactory {
		return (story: string) => ({ scope, component, story });
	}

	public constructor(page: Page, options: TStoryPageOptions) {
		const { scope, component, story, ...storyPageOptions } = options;
		super(page, storyPageOptions);
		this.scope = scope ?? "components";
		this.component = component;
		this.story = story ?? "default";
	}
}
