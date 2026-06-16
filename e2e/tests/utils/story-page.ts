import { type Page } from "@playwright/test";
import { AbstractStoryPage, type TStoryScope } from "./abstract-story-page";

export type TStoryPageOptions = {
	scope?: TStoryScope;
	component: string;
	story?: string;
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
		super(page);
		this.scope = options.scope ?? "components";
		this.component = options.component;
		this.story = options.story ?? "default";
	}
}
