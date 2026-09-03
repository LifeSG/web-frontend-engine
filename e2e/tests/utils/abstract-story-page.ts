import { type Locator, type Page, expect } from "@playwright/test";
import { timestamp as mockedTimestamp, viewport as viewportSizes } from "../consts";
import { compareScreenshot } from "./compare-screenshot";

export type TStoryScope = "components" | "fee";

export type TAbstractStoryPageOptions = {
	useMockedTimestamp?: boolean | string;
	viewport?: {
		size?: keyof typeof viewportSizes | { width: number; height: number };
		orientation?: "portrait" | "landscape";
	};
};

export abstract class AbstractStoryPage {
	public readonly page: Page;
	public readonly layout: Locator;
	private readonly useMockedTimestamp?: TAbstractStoryPageOptions["useMockedTimestamp"];
	private readonly viewport?: TAbstractStoryPageOptions["viewport"];
	private isClockInitialized = false;

	protected readonly scope: TStoryScope = "components";
	protected abstract readonly component: string;
	protected readonly story: string = "default";

	public constructor(page: Page, options?: TAbstractStoryPageOptions) {
		this.page = page;
		this.layout = page.getByTestId("story-layout");
		this.useMockedTimestamp = options?.useMockedTimestamp;
		this.viewport = options?.viewport;
	}

	private async configureClock() {
		if (!this.useMockedTimestamp || this.isClockInitialized) {
			return;
		}

		await this.page.clock.install();
		const timestamp = this.useMockedTimestamp === true ? mockedTimestamp : this.useMockedTimestamp;
		await this.page.clock.setFixedTime(timestamp);
		this.isClockInitialized = true;
	}

	protected getPath() {
		return `/${this.scope}/${this.component}/${this.story}`;
	}

	public async goto() {
		await this.configureClock();

		if (this.viewport) {
			await this.setViewport(this.viewport);
		}

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

	public async setViewport(options: TAbstractStoryPageOptions["viewport"]) {
		const { size = "desktop", orientation = "portrait" } = options || {};
		let viewport: { width: number; height: number };

		if (typeof size === "object") {
			viewport = size;
		} else {
			viewport = viewportSizes[size] || viewportSizes.desktop;
		}

		if (orientation === "landscape") {
			viewport = { width: viewport.height, height: viewport.width };
		}

		await this.page.setViewportSize(viewport);
	}

	public async snapshot(name: string, options?: { fullscreen?: boolean; locator?: Locator; mask?: Locator[] }) {
		await compareScreenshot(this.page, name, options);
	}

	public async waitForImageLoad() {
		await this.page.waitForFunction(
			() => {
				return Array.from(document.querySelectorAll("img")).every(
					(img) => img.complete && img.naturalWidth > 0
				);
			},
			{ polling: 100, timeout: 10000 }
		);
	}

	public async waitForAnimationEnd(locator: Locator) {
		const handle = await locator.elementHandle();
		await handle?.waitForElementState("stable");
		await handle?.dispose();
	}
}
