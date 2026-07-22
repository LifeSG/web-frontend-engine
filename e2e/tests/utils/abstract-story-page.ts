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
		// proxy all asset requests to the local cdn
		await this.page.context().route(/^https:\/\/assets\.life\.gov\.sg/, async (route) => {
			const url = route.request().url();
			const path = new URL(url).pathname;
			const cdn = `http://host.docker.internal:3000/cdn${path}`;

			const res = await this.page.request.get(cdn);
			await route.fulfill({ response: res });
		});

		await this.page.goto(this.getPath());
		await expect(this.layout).toBeVisible();
	}

	public async setViewport(options?: {
		size?: "mobile" | "tablet" | "desktop" | { width: number; height: number };
		orientation?: "portrait" | "landscape";
	}) {
		const { size = "desktop", orientation = "portrait" } = options || {};
		let viewport: { width: number; height: number };

		if (typeof size === "object") {
			viewport = size;
		} else {
			switch (size) {
				case "mobile":
					viewport = { width: 375, height: 667 };
					break;
				case "tablet":
					viewport = { width: 768, height: 1024 };
					break;
				case "desktop":
				default:
					viewport = { width: 1280, height: 720 };
					break;
			}
		}

		if (orientation === "landscape") {
			viewport = { width: viewport.height, height: viewport.width };
		}

		await this.page.setViewportSize(viewport);
	}

	public async snapshot(name: string, options?: { fullscreen?: boolean; locator?: Locator; mask?: Locator[] }) {
		await compareScreenshot(this.page, name, options);
	}
}
