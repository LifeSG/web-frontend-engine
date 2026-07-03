import { type Locator, type Page, expect } from "@playwright/test";
import { compareScreenshot } from "./compare-screenshot";

export type TStoryScope = "components" | "fee";

export abstract class AbstractStoryPage {
	public readonly page: Page;
	public readonly layout: Locator;

	protected readonly scope: TStoryScope = "components";
	protected abstract readonly component: string;
	protected readonly story: string = "default";

	public constructor(page: Page) {
		this.page = page;
		this.layout = page.getByTestId("story-layout");
	}

	protected getPath() {
		return `/${this.scope}/${this.component}/${this.story}`;
	}

	public async goto() {
		await this.page.goto(this.getPath());
		await expect(this.layout).toBeVisible();
	}

	public async snapshot(name: string, options?: { fullscreen?: boolean; locator?: Locator; mask?: Locator[] }) {
		await compareScreenshot(this.page, name, options);
	}
}
